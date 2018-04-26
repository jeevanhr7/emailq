const _ = require('lodash');
const Sequelize = require('sequelize');

const config = require('../../config/environment');

const sqlDefaults = {
  dialect: 'sqlite',
  storage: config.DB_STORAGE || '../emailq.sqlite',
};

const db = {
  sequelize: new Sequelize('emailq', null, null, sqlDefaults),
};

['Template'].forEach(model =>
  (db[model] = db.sequelize.import(`../../api/${_.camelCase(model)}/${_.camelCase(model)}.model.js`)));


Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = db;
