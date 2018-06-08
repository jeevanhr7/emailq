const { AWSRegion } = require('../../config/environment');

function generateSendRawEmailSuccessXMLResponse(messageId) {
  return `
    <SendRawEmailResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
      <SendRawEmailResult>
        <MessageId>${messageId}</MessageId>
      </SendRawEmailResult>
      <ResponseMetadata>
        <RequestId>5ca81a16-6b01-11e8-9ec0-671894d16a7b</RequestId>
      </ResponseMetadata>
    </SendRawEmailResponse>`;
}

module.exports = () => ({

  blankDestination: `<ErrorResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <Error>
    <Type>Sender</Type>
    <Code>ValidationError</Code>
    <Message>1 validation error detected: Value null at 'destination' failed to satisfy constraint: Member must not be null</Message>
  </Error>
  <RequestId>2935d624-6408-11e8-ac9e-a3983410664c</RequestId>
</ErrorResponse>`,

  successXML: `<SendTemplatedEmailResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <SendTemplatedEmailResult>
  <MessageId>{{MessageId}}</MessageId>
</SendTemplatedEmailResult>
<ResponseMetadata>
<RequestId>92cc9bd5-46f3-11e8-b1cf-eb88b8df7515</RequestId>
</ResponseMetadata>
</SendTemplatedEmailResponse>`,

  templateNotExistXml: `<ErrorResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <Error>
    <Type>Sender</Type>
    <Code>TemplateDoesNotExist</Code>
    <Message>Template {{Template}} does not exist</Message>
  </Error>
  <RequestId>e4c2f027-5f3b-11e8-b537-a1fb215b245c</RequestId>
</ErrorResponse>`,

  blankToErrorXml: `<ErrorResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <Error>
    <Type>Sender</Type>
    <Code>InvalidParameterValue</Code>
    <Message>Missing required header 'To'.</Message>
  </Error>
  <RequestId>b4d7383e-5f3c-11e8-b4be-812c23760600</RequestId>
</ErrorResponse>`,

  addressNotVerifiedErrorXML: `<ErrorResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <Error>
    <Type>Sender</Type>
    <Code>MessageRejected</Code>
    <Message>Email address is not verified. The following identities failed the check in region ${AWSRegion.toUpperCase()}: {{IDENTITY}}</Message>
  </Error>
  <RequestId>dcab8787-5f3e-11e8-90b8-b713caf4b232</RequestId>
</ErrorResponse>`,

  wrongEmailxml: `<ErrorResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <Error>
    <Type>Sender</Type>
    <Code>InvalidParameterValue</Code>
    <Message>Missing final '@domain'</Message>
  </Error>
  <RequestId>c1f0214e-63f4-11e8-b3d8-8775242d3656</RequestId>
</ErrorResponse>`,

  bulkTemplatedEmailSuccessXML: `<SendBulkTemplatedEmailResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
  <SendBulkTemplatedEmailResult>
    <Status>
      {{response}}
    </Status>
  </SendBulkTemplatedEmailResult>
  <ResponseMetadata>
    <RequestId>4638905e-4ed6-11e8-907d-11e835b28bc0</RequestId>
  </ResponseMetadata>
</SendBulkTemplatedEmailResponse>`,

  xmlSuccess: `<?xml version="1.0" ?>
<SendEmailResponse xmlns="https://email.amazonaws.com/doc/2010-03-31/">
  <SendEmailResult>
    <MessageId>{{messageId}}</MessageId>
  </SendEmailResult>
  <ResponseMetadata>
    <RequestId>fd3ae762-2563-11df-8cd4-6d4e828a9ae8</RequestId>
  </ResponseMetadata>
</SendEmailResponse>`,
  xmlError: `<?xml version="1.0" ?>
<ErrorResponse xmlns="http://cloudformation.amazonaws.com/doc/2010-05-15/">
  <Error>
    <Type>Sender</Type>
    <Code>Throttling</Code>
    <Message>Rate exceeded</Message>
  </Error>
  <RequestId>fd3ae762-2563-11df-8cd4-6d4e828a9ae8</RequestId>
</ErrorResponse>`,
  createxmlSuccess: `<?xml version="1.0" ?>
      <SendEmailResponse xmlns="https://email.amazonaws.com/doc/2010-03-31/">
        <SendEmailResult>
          <MessageId>{{messageId}}</MessageId>
        </SendEmailResult>
        <ResponseMetadata>
          <RequestId>fd3ae762-2563-11df-8cd4-6d4e828a9ae8</RequestId>
        </ResponseMetadata>
      </SendEmailResponse> `,
  createxmlError: `
    <?xml version="1.0" ?>
    <ErrorResponse xmlns="http://cloudformation.amazonaws.com/doc/2010-05-15/">
      <Error>
        <Type>Sender</Type>
        <Code>Throttling</Code>
        <Message>Rate exceeded</Message>
      </Error>
      <RequestId>fd3ae762-2563-11df-8cd4-6d4e828a9ae8</RequestId>
    </ErrorResponse> `,
  sendRawEmailSuccessXMLResponse: generateSendRawEmailSuccessXMLResponse,
  missingFromParameterXMLResponse: `
    <ErrorResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
      <Error>
        <Type>Sender</Type>
        <Code>InvalidParameterValue</Code>
        <Message>Missing required header 'From'.</Message>
      </Error>
      <RequestId>083e60b9-6b0e-11e8-92f8-ab3210304c63</RequestId>
    </ErrorResponse>`,
});

