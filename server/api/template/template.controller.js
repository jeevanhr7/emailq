const { Template } = require('../../conn/sqldb');
const { AccountId } = require('../../config/environment');
const unflatten = require('../../components/utils/unflatten');

exports.index = (req, res, next) => Template
  .findAll({ raw: true }).then(templates => res.json(templates)).catch(next);

exports.create = (req, res) => {
  // check if template exists
  const { Template: template } = unflatten(req.body);

  return Template
    .create(template)
    .then(() => {
      const successXML = `<CreateTemplateResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
        <CreateTemplateResult/>
        <ResponseMetadata>
          <RequestId>b5084fa4-46d1-11e8-baf2-a7504da2e8d8</RequestId>
        </ResponseMetadata>
      </CreateTemplateResponse>`;

      return res.end(successXML);
    })

    .catch((e) => {
      const errorXml = `<ErrorResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
        <Error>
          <Type>Sender</Type>
          <Code>AlreadyExists</Code>
          <Message>Template ${template.TemplateName} already exists for account id ${AccountId}${
  e.name === 'SequelizeUniqueConstraintError' ? '500' : ''
}</Message>

        </Error>
        <RequestId>5f56719f-46d1-11e8-b0e5-6f6c0c46ee34</RequestId>
      </ErrorResponse>`;

      return res.status(400).end(errorXml);
    });
};

exports.update = (req, res) => {
  const { Template: template } = unflatten(req.body);
  return Template
    .find({ where: { TemplateName: template.TemplateName } })
    .then((result) => {
      if (result) {
        return Template.update(template, { where: { TemplateName: template.TemplateName } });
      }
      return Promise.reject();
    })
    .then(() => {
      const successXML = `<UpdateTemplateResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <UpdateTemplateResult/>
  <ResponseMetadata>
  <RequestId>16012633-488e-11e8-a36e-d56e0ae5dc5d</RequestId>
</ResponseMetadata>
</UpdateTemplateResponse>`;

      return res.end(successXML);
    })
    .catch(() => {
      const errorXml = `<ErrorResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <Error>
    <Type>Sender</Type>
    <Code>TemplateDoesNotExist</Code>
    <Message>Template MyTemplate does not exist.</Message>
  </Error>
  <RequestId>14bc972f-632a-11e8-8f45-29aadae51f12</RequestId>
</ErrorResponse>`;
      return res.header({
        'x-amzn-requestid': '5f56719f-46d1-11e8-b0e5-6f6c0c46ee34',
        date: 'Mon, 23 Apr 2018 08:36:08 GMT',
        'content-length': '306',
        'content-type': 'text/xml',
      }).status(400).end(errorXml);
    });
};

