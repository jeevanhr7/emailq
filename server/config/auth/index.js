const { AWSAccessKeyId } = require('../../config/environment');

const errorXML = `<ErrorResponse xmlns="http://ses.amazonaws.com/doc/2010-12-01/">
        <Error>
          <Type>Sender</Type>
          <Code>InvalidClientTokenId</Code>
          <Message>The security token included in the request is invalid.</Message>
        </Error>
        <RequestId>7b9bdbc5-4df8-11e8-98b1-73c756e0089d</RequestId>
      </ErrorResponse>`;

module.exports = (req, res, next) => {
  if (req.originalUrl === '/' && req.method === 'GET') return res.redirect('/client');
  if (req.query.AWSAccessKeyId === AWSAccessKeyId || (req.headers.authorization && AWSAccessKeyId === req.headers.authorization.split('=')[1].split('/')[0])) return next();
  return res.status(403).end(errorXML);
};
