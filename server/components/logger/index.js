const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const Sentry = require('winston-raven-sentry');

const config = require('../../config/environment');

const logger = new winston.Logger({
  transports: [
    new DailyRotateFile({
      name: 'error-file',
      datePattern: '.yyyy-MM-dd.log',
      filename: `${config.root}/logs/error`,
    }),
    new Sentry({
      dsn: config.NODE_ENV === 'production' && config.SENTRY_DSN,
      install: true,
      config: { environment: config.NODE_ENV, release: '@@_RELEASE_' },
    }),
  ],
});

if (config.NODE_ENV === 'development') logger.add(winston.transports.Console);

module.exports = logger;
