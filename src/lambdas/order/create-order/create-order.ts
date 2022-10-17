const SNS = require('aws-sdk/clients/sns');

const AWS_ACCOUNT_REGION = process.env.AWS_ACCOUNT_REGION;
const KITCHEN_SNS_TOPIC = process.env.KITCHEN_SNS_TOPIC;

export const handler = async (event: any): Promise<any> => {

  let statusCode = 200, bodyMessage = {};

  try {
    let { dishName, dishQuantity } = JSON.parse(event.body);

    if (!dishQuantity) {
      dishQuantity = 1;
    }

    let orderInformation = {
      orderId: event.requestContext.requestId,
      name: dishName,
      quantity: dishQuantity,
      orderedAt: new Date().getTime()
    };

    await notifyNewOrder(orderInformation);

    statusCode = 201;
    bodyMessage = JSON.stringify({
      message: "Orden generada!",
      order: orderInformation,
    });

  } catch (error) {
    statusCode = 400;
    bodyMessage = JSON.stringify({
      message: error
    });
  }

  return {
    statusCode,
    body: bodyMessage,
  };
};

const notifyNewOrder = async (orderInformation : Object) => {

  let sns = new SNS({
    region: AWS_ACCOUNT_REGION
  });

  await sns.publish({
    Message: JSON.stringify(orderInformation),
    MessageStructure: 'sqs',
    TopicArn: KITCHEN_SNS_TOPIC,
    Subject: "New order generated"
  }).promise();

}
