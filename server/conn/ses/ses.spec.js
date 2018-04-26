
Object.flatten = function(data) {
  var result = {};
  function recurse (cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for(var i=0, l=cur.length; i<l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l == 0)
        result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop+"."+p : p);
      }
      if (isEmpty && prop)
        result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
}

const email = {
  "Message": {
    "Subject": {"Data": "from ses", "Charset": "utf8"},
    "Body": {"Html": {"Charset": "utf8", "Data": ""}, "Text": {"Data": "ses says hi", "Charset": "utf8"}}
  },
  "Source": "notifications@quezx.com",
  "Version": "2010-12-01",
  "Action": "SendEmail",
  "Destination": {"ToAddresses": {"member": {"1": "manjeshpv@gmail.com"}}}
}

const ses = require('./index')

ses(Object.flatten(email), 'c-referral-magiclink.js').then(s => console.log('success', s)).catch(er => console.log(er));
