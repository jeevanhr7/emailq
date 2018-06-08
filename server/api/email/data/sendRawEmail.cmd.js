// const fs = require('fs');
//
// const data = fs.readFileSync('files/sample.pdf');
//
// const SOURCE_EMAIL = 'manjeshpv@gmail.com'
// const destination = {
//   ToAddresses: ['shruthi.bharadwaj@quetzal.in', 'manjeshpv@gmail.com'],
//   CcAddresses: ['manjeshpv@ssit.edu.in', 'manjeshpv@gmail.com'],
//   BccAddresses: ['manjesh@quetzal.in', 'manjeshpv@gmail.com'],
// };
//
// let SESMail =
//   `From: ${SOURCE_EMAIL}\n
//   Subject: AWS SES Attachment Example\n
//   MIME-Version: 1.0\n
//   Content-Type: multipart/mixed; boundary="NextPart"\n\n
//   --NextPart\n
//   Content-Type: text/html\n\n
//   This is the body of the email.\n\n
//   --NextPart\n
//   Content-Type: application/octet-stream; name="sample.pdf"\n
//   Content-Transfer-Encoding: base64\n
//   Content-Disposition: attachment\n\n
//   ${data.toString('base64').replace(/([^\0]{76})/g, '$1\n')}\n\n
//   --NextPart--`
//
// const params = {
//   RawMessage: { Data: SESMail },
//   Source: `'AWS SES Attchament Configuration' <${SOURCE_EMAIL}>'`,
//   Destination: destination
// };
//
//
