const aws = require('aws-sdk');
const sesEmail = require('./data/CreateTemplate.cmd');
const assert = require('assert');

const { log } = console;

const { AWSRegion, AWSEndPoint, AWSAccessKeyId, AWSSecretKey } = require('./../../config/environment');

const ses = new aws.SES({
  region: AWSRegion,
  endpoint: AWSEndPoint,
  apiVersion: '2010-12-01',
  accessKeyId: AWSAccessKeyId,
  secretAccessKey: AWSSecretKey,
});

describe('POST CreateTemplate', () => {
  it('respond with xml', () => ses.createTemplate(sesEmail, (err) => {
    if (err) log(err);
    assert.equal(1, 2);
  }));
});
