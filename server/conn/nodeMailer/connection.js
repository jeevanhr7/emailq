const nodemailer = require('nodemailer');
const { htmlToText } = require('nodemailer-html-to-text');
const config = require('../../config/environment');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const options = {
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_SECURE === 'true',
  ignoreTLS: config.SMTP_IGNORETLS === 'true',
  auth: {
    user: config.SMTP_AUTH_USER,
    pass: config.SMTP_AUTH_PASS,
  },
};

if (Number(options.port) === 1025) delete options.auth;

const transporter = nodemailer.createTransport(options);
transporter.use('compile', htmlToText());

module.exports = transporter;
