const _ = require('lodash')
const ses = require('../../conn/ses')
const hbs = require('handlebars')
const {Template} = require('../../conn/sqldb')

exports.SendTemplatedEmail = (req, res, next) => {
  const successXML = `<SendTemplatedEmailResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <SendTemplatedEmailResult>
  <MessageId>{{MessageId}}</MessageId>
</SendTemplatedEmailResult>
<ResponseMetadata>
<RequestId>92cc9bd5-46f3-11e8-b1cf-eb88b8df7515</RequestId>
</ResponseMetadata>
</SendTemplatedEmailResponse>`

  // messageid: 01010162f28582fd-d98807ac-e9a6-4e2d-b0a5-5938a60331ee-000000
  return Template
    .find({
      where: {
        TemplateName: req.body.Template
      },
      raw: true
    })
    .then(template => {
      const email = _.omit(Object.unflatten(req.body), ['TemplateData', 'Template'])

      const data = JSON.parse(req.body.TemplateData)
      email.Message = {
        Subject: {
          Data: hbs.compile(template.SubjectPart)(data)
        },
        Body: {
          Html: {
            Data: hbs.compile(template.HtmlPart)(data)
          }
        }
      }
      // email['Message.Body.Text.Data'] = hbs.compile(template.TextPart)(data);

      return ses(Object.assign(email), req.body.Template)
        .then(r => res.end(successXML.replace('{{MessageId}}', r.messageId)))
        .catch(next)
    })
}

exports.create = (req, res, next) => {
  const xmlSuccess = `<?xml version="1.0" ?>
      <SendEmailResponse xmlns="https://email.amazonaws.com/doc/2010-03-31/">
        <SendEmailResult>
          <MessageId>{{messageId}}</MessageId>
        </SendEmailResult>
        <ResponseMetadata>
          <RequestId>fd3ae762-2563-11df-8cd4-6d4e828a9ae8</RequestId>
        </ResponseMetadata>
      </SendEmailResponse>
      `

  const xmlError = `
    <?xml version="1.0" ?>
    <ErrorResponse xmlns="http://cloudformation.amazonaws.com/doc/2010-05-15/">
      <Error>
        <Type>Sender</Type>
        <Code>Throttling</Code>
        <Message>Rate exceeded</Message>
      </Error>
      <RequestId>fd3ae762-2563-11df-8cd4-6d4e828a9ae8</RequestId>
    </ErrorResponse>
    `

  return ses(req.body)
    .then(r => {
      var rs = xmlSuccess.replace('{{messageId}}', r.messageId)
      return res.end(rs)
    })
    .catch(e => res.end(xmlError))
}

exports.default = function (app) {
  const {
    interval,
    validate,
    error
  } = {
    interval: 1000 * 10,
    validate: false,
    error: 0
  }

  const xmlSuccess = `
<?xml version="1.0" ?>
<SendEmailResponse xmlns="https://email.amazonaws.com/doc/2010-03-31/">
  <SendEmailResult>
    <MessageId>{{messageId}}</MessageId>
  </SendEmailResult>
  <ResponseMetadata>
    <RequestId>fd3ae762-2563-11df-8cd4-6d4e828a9ae8</RequestId>
  </ResponseMetadata>
</SendEmailResponse>
`

  const xmlError = `
<?xml version="1.0" ?>
<ErrorResponse xmlns="http://cloudformation.amazonaws.com/doc/2010-05-15/">
  <Error>
    <Type>Sender</Type>
    <Code>Throttling</Code>
    <Message>Rate exceeded</Message>
  </Error>
  <RequestId>fd3ae762-2563-11df-8cd4-6d4e828a9ae8</RequestId>
</ErrorResponse>
`

  function emailIsValid (body) {
    // @params body = req.body
    // Emails must contain a valid source, destination, subject and body
    const emailBody = body['Message.Body.Text.Data']
    const emailSubject = body['Message.Subject.Data']
    const destination = body['Destination.ToAddresses.member.1']
    const source = body['Source']
    const action = body['Action']
    // Source field exists
    if (!emailBody === undefined) {
      throw new Error('Message body text data is undefined')
    }
    if (!emailSubject === undefined) {
      throw new Error('Message subject data is undefined')
    }
    if (!destination === undefined) {
      throw new Error('No destination email defined')
    }
    if (!source) {
      throw new Error('No source email defined')
    }
    if (!action && action !== 'SendEmail') {
      throw new Error('Incorrect action specified')
    }
  }

  function emailToSend (info) {
    const shouldSendError = (Math.ceil(Math.random() * 100)) <= error
    if (shouldSendError) {
      return {email: xmlError, status: 400}
    } else {
      return {email: xmlSuccess.replace('{{messageId}}', info.messageId), status: 200}
    }
  }

  let numReceived = 0
  // Middleware that will blindly respond to requests
  app.use((req, res) => {
    numReceived++

    // Validate email
    if (validate) {
      emailIsValid(req.body)
    }

    // Mock latency
    const numberBetweenOneAndOneHundredFifty = Math.ceil((Math.random() * 100)) + 50
    return ses(req.body).then((info) => {
      // See https://docs.aws.amazon.com/ses/latest/DeveloperGuide/api-error-codes.html
      const {email, status} = emailToSend(info)
      console.log('-----------------------', status)
      res.statusCode = status
      res.writeHead(status, {'Content-Type': 'text/xml'})
      res.end(email.replace('{{messageId}}', info.messageId))
    }, numberBetweenOneAndOneHundredFifty)
  });

  (function printNumReceived () {
    setTimeout(() => {
      // console.log(`${Math.ceil(numReceived)} requests received in last ${interval / 1000} second(s)`); // eslint-disable-line
      numReceived = 0
      printNumReceived()
    }, interval)
  })()
}

exports.SendBulkTemplatedEmail = (req, res, next) => {
  const responseXML = `<member>
        <MessageId>{{MessageId}}</MessageId>
        <Status>Success</Status>
      </member>`

  // messageid: 01010162f28582fd-d98807ac-e9a6-4e2d-b0a5-5938a60331ee-000000
  return Template
    .find({
      where: {
        TemplateName: req.body.Template
      },
      raw: true
    })
    .then(template => {
      const email = Object.unflatten(req.body)
      console.log('email', email)

      const promises = Object
        .values(email.Destinations.member)
        .map(destination => {
          const data = Object.assign({}, JSON.parse(email.DefaultTemplateData), JSON.parse(destination.ReplacementTemplateData))

          email.Message = {
            Subject: {
              Data: hbs.compile(template.SubjectPart)(data)
            },
            Body: {
              Html: {
                Data: hbs.compile(template.HtmlPart)(data)
              }
            }
          }

          // email['Message.Body.Text.Data'] = hbs.compile(template.TextPart)(data);

          return ses(Object.assign(email, destination), req.body.Template)
        })

      return Promise.all(promises).then(ress => {
        const response = ress.map(r => responseXML.replace('{{MessageId}}', r.messageId)).join('')
        const successXML = `<SendBulkTemplatedEmailResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <SendBulkTemplatedEmailResult>
    <Status>
      ${response}
    
    </Status>
  </SendBulkTemplatedEmailResult>
  <ResponseMetadata>
    <RequestId>4638905e-4ed6-11e8-907d-11e835b28bc0</RequestId>
  </ResponseMetadata>
</SendBulkTemplatedEmailResponse>`

        res.end(successXML)
      })
        .catch(next)
    })
}
