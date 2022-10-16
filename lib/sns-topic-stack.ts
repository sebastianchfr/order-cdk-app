import { Stack, aws_sns as sns, aws_sns_subscriptions as subs } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ISnsStackProps } from "../interfaces";

export class SnsTopicStack extends Stack {
  public readonly kitchenTopics : Record<string, sns.Topic> = {};

  constructor(scope: Construct, id: string, props: ISnsStackProps) {
    super(scope, id, props);

    const topicName = `${props.displayName}-${props.stageName}`;
    this.kitchenTopics["newOrderNotification"] = new sns.Topic(this, "KitchenNotification", {
      displayName: props.displayName,
      topicName: topicName,
    });

    const dishDoneTopicName = `dishDoneNotification-${props.stageName}`;
    this.kitchenTopics["dishDoneNotification"] = new sns.Topic(this, "DishDoneNotification", {
      displayName: "dishDoneNotification",
      topicName: dishDoneTopicName
    });

    this.kitchenTopics["dishDoneNotification"].addSubscription(new subs.EmailSubscription("sebastian.chota@alegra.com"));
  }
}
