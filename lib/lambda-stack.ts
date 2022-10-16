import { Stack, aws_lambda as lambda, aws_lambda_event_sources as lambdaEventSources } from "aws-cdk-lib";
import { ILambdaStackProps } from "../interfaces";
import { Construct } from "constructs";

export class LambdaStack extends Stack {
  public readonly restaurantFree: Record<string, lambda.Function> = {};

  constructor(scope: Construct, id: string, props: ILambdaStackProps) {
    super(scope, id, props);

    const { snsTopic : { kitchenTopics }, sqsQueue : { orderQueue : kitchenQueue} } = props;

    this.restaurantFree["createOrder"] = new lambda.Function(
      this,
      "create-order",
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "create-order.handler",
        code: lambda.Code.fromAsset("./src/lambdas/order/create-order/"),
        description: "create simple order",
      }
    );

    this.restaurantFree["prepareOrder"] = new lambda.Function(
      this,
      "prepare-order",
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "prepare-order.handler",
        code: lambda.Code.fromAsset("./src/lambdas/order/prepare-order/"),
        description: "prepare simple order"
      }
    );

    kitchenTopics["newOrderNotification"].grantPublish(this.restaurantFree["createOrder"]);
    kitchenTopics["dishDoneNotification"].grantPublish(this.restaurantFree["prepareOrder"]);
    
    const eventNewDishToPrepare = new lambdaEventSources.SqsEventSource(kitchenQueue);

    this.restaurantFree["prepareOrder"].addEventSource(eventNewDishToPrepare);

  }
}
