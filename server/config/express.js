const path = require('path');
const bodyParser = require('body-parser');
const config = require('./environment');
const express = require('express');
const routes = require('../routes');
const auth = require('./auth/index');

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.set('appPath', path.join(config.root, 'client'));
  app.use('/client', express.static(app.get('appPath')));
  app.use(auth);
  routes(app);
};
