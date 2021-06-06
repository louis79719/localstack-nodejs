const AWS = require('aws-sdk');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const awsHost = process.env.AWS_HOST || 'http://localhost:4566';
const awsRegion = process.env.AWS_REGION || 'eu-central-1';
const dynamo = new AWS.DynamoDB.DocumentClient({
  endpoint: awsHost,
  region: awsRegion,
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

app.get('/pages/:id', async (req, res, next) => {
  try {
    const pageId = req.params.id
    const { Item } = await dynamo.get({
      TableName: 'pages',
      Key: {
        id: pageId,
      },
    }).promise();

    if(Item) {
      res.send(JSON.stringify(Item));
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
});

app.put('/pages/:id', async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
});

app.use('/', (req, res) => {
  res.send('Fallback routes');
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});