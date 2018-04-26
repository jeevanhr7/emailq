'use strict';
const nodemailer = require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const options = {
    port: 1025 ,
    ignoreTLS: true,
};

if (process.env.NODE_ENV === 'development' && options.host === 'localhost') delete options.auth;
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(options);
let i = 0;

function ses(email) {
    const {Source: from, Headers} = email; console.log('from', from)
    const to = email['Destination.ToAddresses.member.1'];
    const subject = email['Message.Subject.Data'];
    const html = email['Message.Body.Html.Data'];
    const text = email['Message.Body.Text.Data'];

    if (!from) throw new Error('from missing');

    // setup email data with unicode symbols
    let mail = {
        from, // sender address
        to, // list of receivers
        subject, // Subject line
    };

    // hack for urgent
    if(email['Destination.CcAddresses.member.1']){
        const [feedback, unsubUrl] = email['Destination.CcAddresses.member.1'].split('~~');
        mail.headers = {};
        mail.headers['Feedback-ID'] = feedback;
        mail.headers['List-Unsubscribe'] = `<${unsubUrl}>`;
    }

    if (subject) mail.subject = subject;
    if (text) mail.text = text;
    if (html) mail.html = html;

    return new Promise((resolve, reject) => {
        transporter.sendMail(mail, (error, info) => {

            if (error) {
                i++;
                if(i===0) {
                    console.log('err', error);
                }

                return reject(error);
            }
            info.messageId = info.messageId.slice(1, -1);
            return resolve(info);
        });
    })
}

module.exports = ses;
