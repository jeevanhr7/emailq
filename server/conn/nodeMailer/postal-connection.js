const nodemailer = require('nodemailer');
const { htmlToText } = require('nodemailer-html-to-text');
const config = require('../../config/environment');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const options = {
  host: config.POSTAL_SMTP_HOST,
  port: config.POSTAL_SMTP_PORT,
  secure: config.POSTAL_SMTP_SECURE === 'true',
  ignoreTLS: config.POSTAL_SMTP_IGNORETLS === 'true',
  auth: {
    user: config.POSTAL_SMTP_AUTH_USER,
    pass: config.POSTAL_SMTP_AUTH_PASS,
  },
};

if (Number(options.port) === 1025) delete options.auth;

const transporter = nodemailer.createTransport(options);
transporter.use('compile', htmlToText());

module.exports = transporter;
