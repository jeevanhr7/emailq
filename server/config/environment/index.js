const path = require('path');
const dotenv = require('dotenv');

const root = path.normalize(`${__dirname}/../../..`);console.log('root', root)

const env = dotenv.config({ path: path.join(root, '.env') });

const config = {
  all: {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    ip: process.env.IP || '0.0.0.0',
    root,
  },
  development: {

  },

  staging: {

  },

  production: {

  },
};

const conf = Object.assign(env.parsed, config.all,  config[process.env.NODE_ENV || 'development']);

module.exports = conf;
