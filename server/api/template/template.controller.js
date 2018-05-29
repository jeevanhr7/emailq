const { Template } = require('../../conn/sqldb');
const { AccountId } = require('../../config/environment');

exports.index = (req, res, next) => Template
  .findAll({ raw: true }).then(templates => res.json(templates)).catch(next);

exports.create = (req, res, next) => {
  // check if template exists
  const { Template: template } = Object.unflatten(req.body);

  return Template
    .create(template)
    .then(template => {
      var successXML = `<CreateTemplateResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
        <CreateTemplateResult/>
        <ResponseMetadata>
          <RequestId>b5084fa4-46d1-11e8-baf2-a7504da2e8d8</RequestId>
        </ResponseMetadata>
      </CreateTemplateResponse>`;

      return res.end(successXML);
    })
    .catch(e => {

      var errorXml = `<ErrorResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
        <Error>
          <Type>Sender</Type>
          <Code>AlreadyExists</Code>
          <Message>Template ${template.TemplateName} already exists for account id ${AccountId}${
        e.name === 'SequelizeUniqueConstraintError' ? '500' : ''
      }</Message>
        </Error>
        <RequestId>5f56719f-46d1-11e8-b0e5-6f6c0c46ee34</RequestId>
      </ErrorResponse>`;

      return res.status(400).end(errorXml)

    });
}

exports.update = (req, res, next) => {
  const { Template: template } = Object.unflatten(req.body);
  return Template
    .update(template, { where: { TemplateName: template.TemplateName }})
    .then(template => {
      const successXML = `<UpdateTemplateResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <UpdateTemplateResult/>
  <ResponseMetadata>
  <RequestId>16012633-488e-11e8-a36e-d56e0ae5dc5d</RequestId>
</ResponseMetadata>
</UpdateTemplateResponse>`;

      return res.end(successXML);
    })
    .catch(e => {
      var errorXml = `<ErrorResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
        <Error>
          <Type>Sender</Type>
          <Code>AlreadyExists</Code>
          <Message>Template MyTemplate already exists for account id 831107063919</Message>
        </Error>
        <RequestId>5f56719f-46d1-11e8-b0e5-6f6c0c46ee34</RequestId>
      </ErrorResponse>`;
      return res.header({
        'x-amzn-requestid': '5f56719f-46d1-11e8-b0e5-6f6c0c46ee34',
        'date': 'Mon, 23 Apr 2018 08:36:08 GMT',
        'content-length': '306',
        'content-type': 'text/xml'
      }).status(400).end(errorXml)
    });
}

