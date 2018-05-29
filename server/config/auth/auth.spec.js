const aws = require('aws-sdk');
const sesEmail = require('../../api/template/data/CreateTemplate.cmd');
const { expect } = require('chai');
const { AWSEndPoint } = require('./../../config/environment');

describe('Auth wrong', () => {
  it('Create an email Template', (done) => {
    const ses = new aws.SES({
      region: 'us-west-2',
      endpoint: AWSEndPoint,
      apiVersion: '2010-12-01',
      accessKeyId: 'AB', // for sending in request
      secretAccessKey: 'ABCD', // for signing
    });

    ses.createTemplate(sesEmail, (err) => {
      expect(err).to.have.property('code', 'InvalidClientTokenId');
      done();
    });
  });
});
