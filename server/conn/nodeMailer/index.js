const uuidv1 = require('uuid/v1');
const logger = require('../../components/logger');
const connection = require('./connection');
const postalConnection = require('./postal-connection');
const { CONFIGURATIONS, AWSRegion, AWSDomain } = require('../../config/environment');
const wrapLink = require('./wrapLink');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const transporter = {
  sendMail(mail, callback) {
    postalConnection.sendMail(mail, (error) => {
      if (error) logger.error(`EmailQ postal mail send err: ${error}`);
    });

    return connection.sendMail(mail, callback);
  },
};

const generateMessageId = uuid => `<010101646a488ef9-${uuid}-000000@${AWSRegion}.${AWSDomain}>`;

function nodeMailer(email, TemplateName = false) {
  const { Source: from } = email;
  const m = email;
  const to = m.Destination.ToAddresses instanceof Object
    ? Object.values(m.Destination.ToAddresses.member)
    : [];

  const subject = email.Message.Subject.Data;

  if (!from) throw new Error('from missing');

  const mail = {
    from,
    to,
    subject,
  };

  if (email.Message.Body.Html && email.Message.Body.Html.Data) {
    mail.html = email.Message.Body.Html.Data;
  }

  if (email.Message.Body.Text && email.Message.Body.Text.Data) {
    mail.text = email.Message.Body.Text.Data;
  }

  if (email.Message.Body.Html && email.Message.Body.Html.Data) {
    mail.messageId = generateMessageId(uuidv1());

    if (CONFIGURATIONS.split(',').includes('click')) mail.html = wrapLink(email.Message.Body.Html.Data, mail.messageId);
    else mail.html = email.Message.Body.Html.Data;
  }

  const cc = m.Destination.CcAddresses ? Object.values(m.Destination.CcAddresses.member) : [];
  if (cc.length) mail.cc = cc;

  const bcc = m.Destination.BccAddresses ? Object.values(m.Destination.BccAddresses.member) : [];
  if (bcc.length) mail.bcc = bcc;

  if (subject) mail.subject = subject;

  // if (email.Message.Body.Text.Data) mail.text = email.Message.Body.Text.Data

  // Tracking in postal https://github.com/atech/postal
  if (TemplateName) {
    mail.headers = {
      'x-postal-tag': TemplateName,
    };
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mail, (error, i) => {
      if (error) return reject(error);
      const info = i;
      info.messageId = info.messageId.slice(1, -1);

      return resolve(info);
    });
  });
}

function nodeMailerSendRawEmail(email) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(email, (error, i) => {
      if (error) return reject(error);
      const info = i;
      info.messageId = info.messageId.slice(1, -1);
      return resolve(info);
    });
  });
}

module.exports = {
  nodeMailer,
  nodeMailerSendRawEmail,
};
