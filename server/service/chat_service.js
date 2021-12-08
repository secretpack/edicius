const AWS = require("aws-sdk");
const { DynamoDB } = require("aws-sdk");

const Chat = require("../models/Chat");
const Utils = require("../utils/utils");

AWS.config.update({
  region: "localhost",
  accessKeyId: "DEFAULT_ACCESS_KEY",
  secretAccessKey: "DEFAULT_SECRET",
  endpoint: new AWS.Endpoint("http://localhost:8000"),
});

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.connect = async (event, context, callback) => {
  const api = new AWS.ApiGatewayManagementApi({
    endpoint: new AWS.Endpoint("http://localhost:3001"),
  });
  api
    .postToConnection({
      ConnectionId: event.requestContext.connectionId,
      Data: "hello",
    })
    .promise();
  console.log("connect");
  var params = {
    TableName: "ConnectionIds",
    Item: {
      connectionId: event.requestContext.connectionId,
    },
  };
  dynamo.put(params).promise();
  return {
    statusCode: 200,
    body: "Connection OK",
  };
};

module.exports.disconnect = async (event) => {
  try {
    var params = {
      TableName: "ConnectionIds",
      Item: {
        connectionId: event.requestContext.connectionId,
      },
    };
    await dynamo.delete(params).promise();
    return {
      statusCode: 200,
      body: "Disconnect OK",
    };
  } catch (err) {
    // console.log(err);
    console.log("connection failed");
  }
};

module.exports.broadcast = async (event) => {
  var params = {
    TableName: "ConnectionIds",
  };
  const api = new AWS.ApiGatewayManagementApi({
    endpoint: new AWS.Endpoint("http://localhost:3001"),
  });
  const parsedObj = JSON.parse(event.body);
  if (!Utils.hasKeys(parsedObj, ["userid", "room_id"])) {
    return {
      statusCode: 200,
      body: "Unknown credential",
    };
  }

  await Chat.sendMessage(parsedObj);
  const fetched = await dynamo.scan(params).promise();
  console.log(fetched);
  fetched.Items.forEach(async ({ connectionId }) => {
    api
      .postToConnection({
        ConnectionId: connectionId,
        Data: parsedObj.contents,
      })
      .promise();
  });
  return {
    statusCode: 200,
    body: "OK",
  };
};
