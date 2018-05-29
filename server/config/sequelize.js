const path = require('path');

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const settings = {
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || path.join(getUserHome(), 'emailq.sqlite'),
  seederStorage: 'sequelize',
};

module.exports = {
  development: settings,
  test: settings,
  production: settings,
};
