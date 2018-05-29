const sesEmail = require('./data/CreateTemplate.cmd');
const { expect } = require('chai');
const { Template } = require('../../conn/sqldb');
const ses = require('../../conn/ses/config');

async function destroyTemplate() {
  return Template.destroy({ where: { TemplateName: 'MyTemplate' } });
}

describe('POST CreateTemplate', () => {
  it('Create an email Template', (done) => {
    destroyTemplate().then(() => {
      ses.createTemplate(sesEmail, (err, res) => {
        expect(res).to.have.property('ResponseMetadata');
        expect(res.ResponseMetadata).to.have.property('RequestId', 'b5084fa4-46d1-11e8-baf2-a7504da2e8d8');
        done();
      });
    });
  });

  it('should throw error if template already exists', (done) => {
    ses.createTemplate(sesEmail, (err) => {
      expect(err).to.have.property('code', 'AlreadyExists');
      done();
    });
  });
});

describe('UPDATE Template', () => {
  it('should update an email template for a existing template', (done) => {
    ses.updateTemplate(sesEmail, (err, res) => {
      expect(res).to.have.property('ResponseMetadata');
      expect(res.ResponseMetadata).to.have.property('RequestId', '16012633-488e-11e8-a36e-d56e0ae5dc5d');
      done();
    });
  });

  it('should throw error if template does not exists', (done) => {
    destroyTemplate().then(() => {
      ses.updateTemplate(sesEmail, (err) => {
        expect(err).to.have.property('code', 'TemplateDoesNotExist');
        done();
      });
    });
  });
});
