import { Stack, aws_sqs as sqs, Duration, aws_sns_subscriptions as subs } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ISqsStackProps } from "../interfaces";

export class SqsStack extends Stack {

  public readonly orderQueue : sqs.Queue;

  constructor(scope: Construct, id: string, props: ISqsStackProps) {
    super(scope, id, props);

    const { notifier : { kitchenTopics } } = props;

    this.orderQueue = new sqs.Queue(this, "orderQueue", {
      visibilityTimeout: Duration.seconds(120),
      queueName: props.queueName
    });

    kitchenTopics["newOrderNotification"].addSubscription(new subs.SqsSubscription(this.orderQueue));
  }
}
