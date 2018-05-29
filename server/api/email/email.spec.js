const addressparser = require('addressparser');
const assert = require('assert');

describe('addressparser', () => {
  it('should return email', (done) => {
    const mails = addressparser('"Manjesh via India.com" <india@example.com>');
    assert(mails[0].address === 'india@example.com', 'mail should be indai@example.com');
    done();
  });
});
