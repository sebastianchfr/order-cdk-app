import {StackProps} from "aws-cdk-lib";
import {LambdaStack} from "../lib/lambda-stack";
import { SnsTopicStack } from "../lib/sns-topic-stack";
import { SqsStack } from "../lib/sqs-stack";

export interface IBaseStackProps extends StackProps {
    stageName: string,
}

export interface IApiGatewayStackProps extends IBaseStackProps {
    lambdaStack: LambdaStack
}

export interface ILambdaStackProps extends IBaseStackProps {
    snsTopic: SnsTopicStack,
    sqsQueue: SqsStack
}

export interface ISnsStackProps extends IBaseStackProps {
    displayName: string 
}

export interface ISqsStackProps extends IBaseStackProps {
    queueName: string,
    notifier: SnsTopicStack
}