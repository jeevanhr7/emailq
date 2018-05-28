const addressparser = require('addressparser');

describe('addressparser', () => {
  it('should return email', (done) => {
    const mail = addressparser('"Manjesh via India.com" <india@example.com>');
    console.log('email', mail);
    done()
  })
})

