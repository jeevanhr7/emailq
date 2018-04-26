const rp = require('request-promise');

const sesEmail = require('./data/CreateTemplate.cmd');

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

