
/**
 * Main application routes
 */
const debug = require('debug');
const { name, version } = require('../package.json');

const { EMAIL_IDENTITY, DOMAIN_IDENTITY, DAILY_LIMIT, MAX_SEND_RATE } = require('./config/environment');
const TemplateCtrl = require('./api/template/template.controller');
const EmailCtrl = require('./api/email/email.controller');

const template = require('./api/template');
const logger = require('./components/logger');

const log = debug('emailq.routes');

const quotaResultXML = `<GetSendQuotaResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <GetSendQuotaResult>
    <Max24HourSend>${DAILY_LIMIT || 50000}.0</Max24HourSend>
    <SentLast24Hours>10.0</SentLast24Hours>
    <MaxSendRate>${MAX_SEND_RATE || 14}.0</MaxSendRate>
  </GetSendQuotaResult>
  <ResponseMetadata>
    <RequestId>17bc8d24-7379-11e8-a376-31af453c5b41</RequestId>
  </ResponseMetadata>
</GetSendQuotaResponse>`;

const listIdentitySuccessXML = `<ListIdentitiesResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <ListIdentitiesResult>
     <Identities>
        ${EMAIL_IDENTITY.split(',').map(x => ` <member>${x}</member>`).join('')}
    </Identities>
  </ListIdentitiesResult>
  <ResponseMetadata>
    <RequestId>ed9bf8a3-7380-11e8-8d53-b12c812ff2c5</RequestId>
  </ResponseMetadata>
</ListIdentitiesResponse>
`;

const domainlistIdentitySuccessXML = `<ListIdentitiesResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <ListIdentitiesResult>
     <Identities>
        ${DOMAIN_IDENTITY.split(',').map(x => ` <member>${x}</member>`).join('')}
    </Identities>
  </ListIdentitiesResult>
  <ResponseMetadata>
    <RequestId>ed9bf8a3-7380-11e8-8d53-b12c812ff2c5</RequestId>
  </ResponseMetadata>
</ListIdentitiesResponse>`;

const setSNSXSuccessXML = `<SetIdentityNotificationTopicResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <SetIdentityNotificationTopicResult/>
  <ResponseMetadata>
    <RequestId>05fbec4d-7389-11e8-997a-198bfc8ec01a</RequestId>
  </ResponseMetadata>
</SetIdentityNotificationTopicResponse>`;

module.exports = (app) => {
  app.use('/', (req, res, next) => {
    if (req.method !== 'POST') return next();
    log('request', JSON.stringify(req.body));
    switch (req.body.Action) {
      case 'CreateTemplate': return TemplateCtrl.create(req, res, next);
      case 'SendEmail': return EmailCtrl.create(req, res, next);
      case 'SendBulkTemplatedEmail': return EmailCtrl.SendBulkTemplatedEmail(req, res, next);
      case 'SendTemplatedEmail': return EmailCtrl.SendTemplatedEmail(req, res, next);
      case 'SendRawEmail': return EmailCtrl.SendRawEmail(req, res, next);
      case 'UpdateTemplate': return TemplateCtrl.update(req, res, next);
      case 'GetSendQuota': return res.end(quotaResultXML);
      case 'SetIdentityNotificationTopic': return res.end(setSNSXSuccessXML);
      case 'ListIdentities': {
        if (req.body.IdentityType === 'EmailAddress') return res.end(listIdentitySuccessXML);
        if (req.body.IdentityType === 'Domain') return res.end(domainlistIdentitySuccessXML);
        return res.end(quotaResultXML);
      }
      default: return next();
    }
  });
  app.use('/templates', template);
  app.get('/emails', (req, res) => res.json(EMAIL_IDENTITY.split(',')));
  app.get('/domains', (req, res) => res.json(DOMAIN_IDENTITY.split(',')));
  app.get('/', (req, res) => res.json({ name, version }));
  app.use(logger.transports.sentry.raven.errorHandler());
  // All undefined asset or api routes should return a 404
  app.use((e, req, res, next) => {
    if (!next) return false;
    const err = e;
    const { body, headers, user } = req;

    logger.error(err.message, err, {
      url: req.originalUrl,
      body,
      headers,
      user,
    });

    return res.status(500).json({ message: err.message, stack: err.stack });
  });


  app.route('/*').get((req, res) => res.status(404).json({ message: '404' }));
};
