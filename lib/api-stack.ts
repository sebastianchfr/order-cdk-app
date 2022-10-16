import { Stack, aws_apigateway as apiGw } from "aws-cdk-lib";
import { Construct } from "constructs";
import { IApiGatewayStackProps } from "../interfaces";

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: IApiGatewayStackProps) {
    super(scope, id, props);

    const {
      lambdaStack: { restaurantFree },
    } = props;

    const api = new apiGw.RestApi(this, "api", {
      restApiName: "restaurantApi",
      description: "created from cdk training",
      deployOptions: {
        stageName: props.stageName,
      },
    });

    /* Models */
    const orderModel = new apiGw.Model(this, "OrderModelValidator", {
      restApi: api,
      contentType: "application/json",
      description: "validate body request on order creation",
      modelName: "orderModel",
      schema: {
        type: apiGw.JsonSchemaType.OBJECT,
        required: ["dishName"],
        properties: {
          dishName: {
            type: apiGw.JsonSchemaType.STRING,
          },
          dishQuantity: {
            type: apiGw.JsonSchemaType.INTEGER,
          },
        },
      },
    });

    /* Resources */
    const orderResource = api.root.addResource("orders");

    /* Integrations */
    const createOrderEndpoint = new apiGw.LambdaIntegration(
      restaurantFree.createOrder
    );

    orderResource.addMethod("POST", createOrderEndpoint, {
      requestValidator: new apiGw.RequestValidator(this, "OrderBodyValidator", {
        restApi: api,
        requestValidatorName: "orderBodyValidator",
        validateRequestBody: true,
      }),
      requestModels: {
        "application/json": orderModel,
      },
    });
  }
}
