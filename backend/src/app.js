const AWS = require('aws-sdk');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
};
const awsHost = process.env.AWS_HOST || 'http://localhost:4566';
const dynamo = new AWS.DynamoDB.DocumentClient({
  endpoint: awsHost,
  credentials,
});

const app = express();
const port = process.env.PORT || 8080;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
    },
  },
}));
app.use(bodyParser.json());

app.get('/pages/:id', async (req, res) => {
  const pageId = req.params.id
  const { Item } = await dynamo.get({
    TableName: 'pages',
    Key: {
      id: pageId,
    },
  }).promise();

  res.send(JSON.stringify(Item));
});

app.put('/pages/:id', async (req, res) => {
  const pageId = req.params.id
  const payload = req.body
  const { Attributes } = await dynamo.put({
    TableName: 'pages',
    Item: {
      id: pageId,
      ...payload,
    },
    ReturnValues: 'ALL_OLD',
  }).promise();

  res.send(JSON.stringify(Attributes));
});

app.use('/', (req, res) => {
  res.send('Fallback routes');
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});