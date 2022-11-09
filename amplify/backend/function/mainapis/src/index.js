const awsServerlessExpress = require('aws-serverless-express');
const createApp = require('./app');
const app = createApp();

app.listen(3000, () => console.log(`starting server`));

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
