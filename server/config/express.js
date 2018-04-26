const path = require('path');
const bodyParser = require('body-parser');
const config = {
  root: path.normalize(`${__dirname}/..`),
}

module.exports = function (app) {
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.set('appPath', path.join(config.root, 'client'));
    require('../routes')(app);
}
