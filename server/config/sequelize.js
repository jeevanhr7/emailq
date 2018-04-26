const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const pkg = require('../../package.json');

const root = path.normalize(`${__dirname}/../..`);
const envFile = path.join(root, '.env');
let config = {};

if (fs.existsSync(envFile)) {
  const env = dotenv.config({ path: envFile });
  config = env.parsed || env;
} else {
  console.log(`.env file not found.
  Please create manually or visit http://localhost:3000
  Learn more at check installation docs at https://github.com/manjeshpv/mailq/blob/${pkg.version}/docs/Installation.md
  Trying to connect with default settings.
  `);
}
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const settings = {
  dialect: "sqlite",
  storage: process.env.DB_STORAGE || '../mailq.sqlite',
  seederStorage: 'sequelize',
};

module.exports = {
  development: settings,
  production: settings,
};
