
const rp = require('request-promise');

const sesEmail = { Action: 'SendEmail',
    'Destination.ToAddresses.member.1': '<manjeshpv@gmail.com>',
    'Message.Body.Text.Data': 'Campaign: "ad/jobs.csv" has been successfully delivered.\n\nDuration: 0.00 minutes',
    'Message.Subject.Data': 'MfG: campaign delivered',
    Source: '"Mail for Good" <manjeshpv@gmail.com>',
    Version: '2010-12-01' };

var options = {
    method: 'POST',
    uri: 'http://localhost:9999',
    form: sesEmail,
    resolveWithFullResponse: true

};

test('adds 1 + 2 to equal 3', () => {
    rp(options)
        .then(function (response) {
            expect(response.statusCode).toBe(200);
        })
        .catch(function (err) {
            console.log('err----------------------', err, err.statusCode, err.message);
            // POST failed...
        });
});

