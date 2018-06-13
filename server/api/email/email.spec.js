const addressparser = require('addressparser');
const { expect } = require('chai');
const sesEmail = require('../template/data/CreateTemplate.cmd');
const { Template } = require('../../conn/sqldb');
const ses = require('../../conn/ses/config');
const sampleSendEmailData = require('./data/sendTemplatedEmail.cmd');
const sampleSendBulkEmailData = require('./data/blukemail.cmd');
const unflatten = require('../../components/utils/unflatten');

async function destroyTemplate() {
  return Template.destroy({ where: { TemplateName: 'MyTemplate' } });
}

async function createTemplate() {
  const { Template: template } = unflatten(sesEmail);
  return Template.create(template);
}

describe('addressparser', () => {
  it('should return email', (done) => {
    const mails = addressparser('"Manjesh via India.com" <india@example.com>');
    expect(mails[0].address).to.equal('india@example.com');
    done();
  });
});
describe('SendTemplatedEmail', () => {
  beforeEach(async () => {
    await destroyTemplate();
    await createTemplate(sesEmail);
  });

  it('should send email', (done) => {
    ses.sendTemplatedEmail(sampleSendEmailData, (err, res) => {
      expect(res).to.have.property('ResponseMetadata');
      expect(res.ResponseMetadata).to.have.property('RequestId', '92cc9bd5-46f3-11e8-b1cf-eb88b8df7515');
      done();
    });
  });

  it('should throw error if source email Id is not an authorized email sender', (done) => {
    ses.sendTemplatedEmail({ ...sampleSendEmailData, Source: 'abc@abc.com' }, (err) => {
      expect(err).to.have.property('statusCode', 400);
      expect(err).to.have.property('code', 'MessageRejected');
      expect(err).to.have.property('message', 'Email address is not verified. The following ' +
        'identities failed the check in region US-WEST-2: abc@abc.com');
      done();
    });
  });

  it('should throw error if no destination email addresses are provided ', (done) => {
    ses.sendTemplatedEmail({ ...sampleSendEmailData, Destination: {} }, (err) => {
      expect(err).to.have.property('statusCode', 400);
      expect(err).to.have.property('code', 'ValidationError');
      const message = '1 validation error detected: Value null at \'destination\' failed to sati' +
        'sfy constraint: Member must not be null';
      expect(err).to.have.property('message', message);
      done();
    });
  });

  it('should throw error if any destination email address is wrongly formatted  ', (done) => {
    ses
      .sendTemplatedEmail({
        ...sampleSendEmailData,
        Destination: {
          ...sampleSendEmailData.Destination, CcAddresses: ['testing'],
        },
      }, (err) => {
        expect(err).to.have.property('statusCode', 400);
        expect(err).to.have.property('code', 'InvalidParameterValue');
        expect(err).to.have.property('message', "Missing final '@domain'");
        done();
      });
  });

  it('should throw error if the template specified is not created', (done) => {
    ses.sendTemplatedEmail({ ...sampleSendEmailData, Template: 'test' }, (err) => {
      expect(err).to.have.property('statusCode', 400);
      expect(err).to.have.property('code', 'TemplateDoesNotExist');
      expect(err).to.have.property('message', 'Template test does not exist');
      done();
    });
  });
});

describe('SendBulkTemplatedEmail', () => {
  beforeEach(async () => {
    await destroyTemplate();
    await createTemplate(sesEmail);
  });

  it('should send email to many recipients', (done) => {
    ses.sendBulkTemplatedEmail(sampleSendBulkEmailData, (err, res) => {
      expect(res).to.have.property('ResponseMetadata');
      expect(res.ResponseMetadata).to.have.property('RequestId');
      expect(res.Status).to.be.an('array');
      expect(res.Status).to.have.lengthOf(2);
      done();
    });
  });

});

