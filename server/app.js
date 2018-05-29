Object.unflatten = (data) => {
  if (Object(data) !== data || Array.isArray(data)) {
    return data;
  }
  // eslint-disable-next-line no-useless-escape
  const regex = /\.?([^.\[\]]+)|\[(\d+)\]/g;
  const resultholder = {};
  Object.keys(data).forEach((p) => {
    let cur = resultholder;
    let prop = '';
    let m;
    // eslint-disable-next-line no-cond-assign
    while (m = regex.exec(p)) {
      cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  });
  return resultholder[''] || resultholder;
};

Object.flatten = (data) => {
  const result = {};

  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      const l = cur.length;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < l; i++) {
        recurse(cur[i], `${prop}[${i}]`);
      }
      if (l === 0) {
        result[prop] = [];
      }
    } else {
      let isEmpty = true;
      Object.keys(cur).forEach((p) => {
        isEmpty = false;
        recurse(cur[p], prop ? `${prop}.${p}` : p);
      });
      if (isEmpty && prop) { result[prop] = {}; }
    }
  }

  recurse(data, '');
  return result;
};

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
