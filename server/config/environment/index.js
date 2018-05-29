const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

const root = path.normalize(`${__dirname}/../../..`);

if (!fs.existsSync(path.join(getUserHome(), '.emailq'))) {
  fs.writeFileSync(path.join(getUserHome(), '.emailq'), 'SMTP_PORT=1025');
}

const env = dotenv.config({ path: path.join(getUserHome(), '.emailq') });
process.env.NODE_ENV = process.env.NODE_ENV || env.NODE_ENV || 'development';
const config = {
  all: {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    ip: process.env.IP || '0.0.0.0',
    root,
    AWSRegion: process.env.AWSRegion || 'us-west-2',
    AWSEndPoint: process.env.AWSEndPoint || 'http://127.0.0.1:1587',
    AWSSecretKey: process.env.AWSSecretKey,
    AWSAccessKeyId: process.env.AWSAccessKeyId,
    AccountId: 706391958311,
  },
  development: {},

  staging: {},

  production: {},
};

const conf = Object.assign({}, env.parsed, config.all, config[process.env.NODE_ENV || 'development']);

module.exports = conf;
