const Ajv = require('ajv');
const _ = require('lodash');
const debug = require('debug');
const hbs = require('handlebars');
const addressparser = require('addressparser');
const { simpleParser } = require('mailparser');

const { nodeMailer, nodeMailerSendRawEmail } = require('../../conn/nodeMailer');
const { Template } = require('../../conn/sqldb');
const {
  blankDestination,
  blankToErrorXml,
  successXML,
  templateNotExistXml,
  addressNotVerifiedErrorXML,
  wrongEmailxml,
  bulkTemplatedEmailSuccessXML,
  createxmlSuccess,
  createxmlError,
  sendRawEmailSuccessXMLResponse,
  missingFromParameterXMLResponse,
} = require('./email.response')();
const { DOMAIN_IDENTITY, EMAIL_IDENTITY } = require('../../config/environment');

const unflatten = require('../../components/utils/unflatten');

const log = debug('email.controller:api');

const validEmails = (emails) => {
  const ajv = new Ajv();
  ajv.addSchema({
    title: 'Emails',
    type: 'array',
    items: {
      type: 'string',
      format: 'email',
    },
  }, 'Emails');

  const valid = ajv.validate('Emails', emails);

  // if (!valid) throw new Error(ajv.errorsText());
  return valid;
};

exports.SendTemplatedEmail = (req, res, next) => {
  const body = unflatten(req.body);

  const email = _.omit(body, ['TemplateData', 'Template']);

  const emailIdentity = addressparser(email.Source)[0].address;
  const [, domainIdentity] = emailIdentity.split('@');

  const domainAllowed = DOMAIN_IDENTITY.split(',').includes(domainIdentity);
  const emailAllowed = EMAIL_IDENTITY.split(',').includes(emailIdentity);

  log({ domainAllowed, emailAllowed });
  if (!(domainAllowed || emailAllowed)) {
    return res.status(400).end(addressNotVerifiedErrorXML.replace('{{IDENTITY}}', email.Source));
  }

  // email['Message.Body.Text.Data'] = hbs.compile(template.TextPart)(data);
  log('email.Destination', email.Destination);
  if (!email.Destination || (email.Destination && !Object.keys(email.Destination).length)) {
    return res.status(400).end(blankDestination);
  }
  const to = email.Destination.ToAddresses instanceof Object
    ? Object.values(email.Destination.ToAddresses.member)
    : [];

  const cc = email.Destination.CcAddresses instanceof Object
    ? Object.values(email.Destination.CcAddresses.member)
    : [];

  const bcc = email.Destination.BccAddresses instanceof Object
    ? Object.values(email.Destination.BccAddresses.member)
    : [];

  if (!validEmails([...to, ...cc, ...bcc])) {
    log('wrongEmailxml');
    return res.status(400).end(wrongEmailxml);
  }

  if (to.length === 0 && cc.length === 0 && bcc.length === 0) {
    log('no emails');
    return res.status(400).end(blankToErrorXml);
  }

  // messageid: 01010162f28582fd-d98807ac-e9a6-4e2d-b0a5-5938a60331ee-000000
  return Template
    .find({
      where: {
        TemplateName: req.body.Template,
      },
      raw: true,
    })
    .then((template) => {
      log('!template', !template);
      if (!template) {
        return res.status(400)
          .end(templateNotExistXml.replace('{{Template}}', req.body.Template));
      }

      const data = JSON.parse(req.body.TemplateData);
      email.Message = {
        Subject: {
          Data: hbs.compile(template.SubjectPart)(data),
        },
        Body: {
          Html: {
            Data: hbs.compile(template.HtmlPart)(data),
          },
        },
      };

      return nodeMailer(email, req.body.Template)
        .then((r) => {
          log('email sent', r);
          res.end(successXML.replace('{{MessageId}}', r.messageId));
        });
    })
    .catch(next);
};

exports.create = (req, res) => nodeMailer(req.body)
  .then((r) => {
    const rs = createxmlSuccess.replace('{{messageId}}', r.messageId);
    return res.end(rs);
  })
  // eslint-disable-next-line no-unused-vars
  .catch(e => res.end(createxmlError));

exports.SendBulkTemplatedEmail = (req, res, next) => {
  const responseXML = `<member>
        <MessageId>{{MessageId}}</MessageId>
        <Status>Success</Status>
      </member>`;

  // messageid: 01010162f28582fd-d98807ac-e9a6-4e2d-b0a5-5938a60331ee-000000
  return Template
    .find({
      where: {
        TemplateName: req.body.Template,
      },
      raw: true,
    })
    .then((template) => {
      const email = unflatten(req.body);
      log('email', email);

      const promises = Object
        .values(email.Destinations.member)
        .map((destination) => {
          const data = Object
            .assign(
              {},
              JSON.parse(email.DefaultTemplateData),
              JSON.parse(destination.ReplacementTemplateData));

          email.Message = {
            Subject: {
              Data: hbs.compile(template.SubjectPart)(data),
            },
            Body: {
              Html: {
                Data: hbs.compile(template.HtmlPart)(data),
              },
            },
          };

          // email['Message.Body.Text.Data'] = hbs.compile(template.TextPart)(data);

          return nodeMailer({ ...email, ...destination }, req.body.Template);
        });

      return Promise.all(promises).then((ress) => {
        const response = ress.map(r => responseXML.replace('{{MessageId}}', r.messageId)).join('');


        res.end(bulkTemplatedEmailSuccessXML.replace('{{response}}', response));
      });
    }).catch(next);
};

function getEmails(addresses) {
  return addresses.filter(email => email.address && email.address.trim() !== '').map(email => email.address);
}

function authenticateSourceEmail(email) {
  const domainAllowed = DOMAIN_IDENTITY.split(',').includes(email.split('@')[0]);
  const emailAllowed = EMAIL_IDENTITY.split(',').includes(email);
  return domainAllowed || emailAllowed;
}

exports.SendRawEmail = async (req, res, next) => {
  const rawEmailContents = Buffer.from(req.body['RawMessage.Data'], 'base64').toString();
  const formattedMailContents = await simpleParser(rawEmailContents);
  formattedMailContents.to = formattedMailContents.to
    ? getEmails(formattedMailContents.to.value)
    : [];
  formattedMailContents.cc = formattedMailContents.cc
    ? getEmails(formattedMailContents.cc.value)
    : [];
  formattedMailContents.bcc = formattedMailContents.bcc
    ? getEmails(formattedMailContents.bcc.value)
    : [];
  let source = req.body.Source;
  if (source) {
    if (!authenticateSourceEmail(source)) {
      return res.status(400).end(addressNotVerifiedErrorXML.replace('{{IDENTITY}}', source));
    }
  }
  if (formattedMailContents.from) {
    source = getEmails(formattedMailContents.from.value)[0];
  }
  if (!source) {
    return res.status(400).end(missingFromParameterXMLResponse);
  }
  if (!authenticateSourceEmail(source)) {
    return res.status(400).end(addressNotVerifiedErrorXML.replace('{{IDENTITY}}', source));
  }

  const { to = [], cc = [], bcc = [] } = formattedMailContents;
  if (!validEmails([...to, ...cc, ...bcc])) {
    log('wrongEmailxml');
    return res.status(400).end(wrongEmailxml);
  }
  //
  if (to.length === 0 && cc.length === 0 && bcc.length === 0) {
    log('no emails');
    return res.status(400).end(blankToErrorXml);
  }
  return nodeMailerSendRawEmail(formattedMailContents)
    .then(sentMailDetails => res.send(sendRawEmailSuccessXMLResponse(sentMailDetails.messageId)))
    .catch(next);
};
