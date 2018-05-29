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

function nodeMailer(email, TemplateName = false) {
  const { Source: from } = email;
  const m = email;
  const to = Object.values(m.Destination.ToAddresses.member);

  const subject = email.Message.Subject.Data;
  const html = email.Message.Body.Html.Data;

  if (!from) throw new Error('from missing');

  const mail = {
    from,
    to,
    subject,
  };

  const cc = m.Destination.CcAddresses ? Object.values(m.Destination.CcAddresses.member) : [];
  if (cc.length) mail.cc = cc;

  const bcc = m.Destination.BccAddresses ? Object.values(m.Destination.BccAddresses.member) : [];
  if (bcc.length) mail.bcc = bcc;

  if (subject) mail.subject = subject;
  if (html) mail.html = html;

  // if (email.Message.Body.Text.Data) mail.text = email.Message.Body.Text.Data

  // Tracking in postal https://github.com/atech/postal
  if (TemplateName) {
    mail.headers = {
      'x-postal-tag': TemplateName,
    };
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mail, (error, i) => {
      if (error) return reject(error);
      const info = i;
      info.messageId = info.messageId.slice(1, -1);

      return resolve(info);
    });
  });
}

module.exports = nodeMailer;
