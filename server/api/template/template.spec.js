const aws = require('aws-sdk')
const sesEmail = require('./data/CreateTemplate.cmd')
const app = require('./../../app')
const request = require('supertest')

const ses = new aws.SES({
  region: 'us-west-2',
  endpoint: 'http://localhost:1587',
  apiVersion: '2010-12-01',
  accessKeyId: 'AB',
  secretAccessKey: 'CD'
})
const sendJson = {
  'Template.TextPart': 'Dear {{name}},\r\nYour favorite animal is {{favoriteanimal}}.',
  'Template.SubjectPart': 'Greetings, {{name}}!',
  'Template.HtmlPart': '<h1>Hello {{name}},</h1><p>Your favorite animal is {{favoriteanimal}}.</p>',
  'Template.TemplateName': 'MyTemplate',
  'Version': '2010-12-01',
  'Action': 'CreateTemplate'
}

describe('POST CreateTemplate', function () {
  it('respond with xml', function () {

    return ses.createTemplate(sesEmail, function (err, data) {
      console.log('data', data)
      if (err) console.log(err)
      console.log(data)
      assert.equal(1, 2)
    })
  })
})
//
// describe('POST CreateTemplate', function () {
//   it('respond with json ', function () {
//     request(app)
//       .post('/')
//       .send(sendJson)
//
//       .end((res) => {
//         throw error()
//         console.log('body',res)
//
//       })
//       // .expect('Content-Type', 'text/html; charset=utf-8')
//       // .expect(200)
//
//   })
// })
