const SNS = require('aws-sdk/clients/sns');

const AWS_ACCOUNT_REGION = process.env.AWS_ACCOUNT_REGION;
const DISH_DONE_SNS_TOPIC = process.env.DISH_DONE_SNS_TOPIC;

export const handler = async (event: any) : Promise<void> => {

    const orderMessage = getMessageBodySqs(event);

    console.log(orderMessage);

    if (!orderMessage.orderId) {
        throw new Error("orderId not exist");
    }

    await notifyOrderDone(orderMessage);
}

const notifyOrderDone = async (orderInformation : Object) => {

    let sns = new SNS({
      region: AWS_ACCOUNT_REGION
    });
  
    await sns.publish({
      Message: JSON.stringify(orderInformation),
      MessageStructure: 'email-json',
      TopicArn: DISH_DONE_SNS_TOPIC,
      Subject: "dish order done"
    }).promise();
  
}

const getMessageBodySqs = (event: any) : any => {

    const body = JSON.parse(event.Records[0].body);

    const message = JSON.parse(body.Message);

    return message ?? {};
}