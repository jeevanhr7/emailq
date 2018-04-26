const _ = require('lodash');
const Sequelize = require('sequelize');

const config = require('../../config/environment');
console.log('config', config)

const sqlDefaults = {
  dialect: 'sqlite',
  storage: config.DB_STORAGE || '../mailq.sqlite',
};

const db = {
  sequelize: new Sequelize('mailq', null, null, sqlDefaults),
};

['Template'].forEach(model =>
  (db[model] = db.sequelize.import(`../../api/${_.camelCase(model)}/${_.camelCase(model)}.model.js`)));


Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = db;
