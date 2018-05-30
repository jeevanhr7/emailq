
const http = require('http');
const express = require('express');

const config = require('./config/environment');

const { log } = console;
const app = express();

require('./config/express')(app);

const {
  host,
  port,
} = {
  host: '0.0.0.0',
  port: 1587,
};

process.on('unhandledRejection', (reason, p) => {
  log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
  log('uncaughtException', err);
});

const server = http.createServer(app);

if (config.env !== 'test') {
  server.listen(port, host, () => {
    log('\n######################################################');
    log('## EmailQ: Amazon SES Compatible                    ##');
    log('######################################################\n##');
    log(`## AWSAccessKeyId: ${config.AWSAccessKeyId}`);
    log(`## AWSSecretKey: ${config.AWSSecretKey}`);
    log(`## AWSSecretKey: ${config.AWSRegion}`);
    log(`## AWSEndPoint: ${config.AWSEndPoint || `http://${host}:${port}`}`);
    log(`## SMTP_HOST: ${config.SMTP_HOST || 'NA'}`);
    log(`## SMTP_PORT: ${config.SMTP_PORT || 'NA'}`);
    log(`## SMTP_SECURE: ${config.SMTP_SECURE || 'NA'}`);
    log(`## SMTP_IGNORETLS: ${config.SMTP_IGNORETLS || 'NA'}`);
    log(`## SMTP_AUTH_USER: ${config.SMTP_AUTH_USER || 'NA'}`);
    log(`## SMTP_AUTH_PASS: ${config.SMTP_AUTH_PASS || 'NA'}`);
    log('## Update SMTP settings in `~/.emailq` and restart server');
    log('## To start demo email server `npm i -g maildev && maildev`');
    log('##\n#######################################################\n');
  });
}

module.exports = app;
