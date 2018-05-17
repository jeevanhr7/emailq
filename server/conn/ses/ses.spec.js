

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


var assert = require('assert');
describe('AWS', function() {
  describe('ses()', function() {
    it('should return -1 when the value is not present', function(done) {

      ses(email 'c-referral-magiclink.js')
    .then(s => {
      console.log('success', s)
        done()
      }).catch(er => console.log(er));
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});
