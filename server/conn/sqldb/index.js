const _ = require('lodash');
const path = require('path');
const Sequelize = require('sequelize');

const config = require('../../config/environment');

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

const sqlDefaults = {
  dialect: 'sqlite',
  storage: config.DB_STORAGE || path.join(getUserHome(), 'emailq.sqlite'),
};

const db = {
  sequelize: new Sequelize('emailq', null, null, sqlDefaults),
};

['Template'].forEach((model) => {
  db[model] = db.sequelize.import(`../../api/${_.camelCase(model)}/${_.camelCase(model)}.model.js`);
});


Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = db;
