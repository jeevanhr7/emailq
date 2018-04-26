const email = {
  "Message": {
    "Subject": {"Data": "from ses", "Charset": "utf8"},
    "Body": {"Html": {"Charset": "utf8", "Data": ""}, "Text": {"Data": "ses says hi", "Charset": "utf8"}}
  },
  "Source": "john@gmail.com",
  "Version": "2010-12-01",
  "Action": "SendEmail",
  "Destination": {"ToAddresses": {"member": {"1": "mike@gmail.com"}}}
}

const ses = require('./index')

ses(email).then(s => console.log('success', s)).catch(er => console.log(er));
