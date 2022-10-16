#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import 'dotenv/config';
import {LambdaStack} from "../lib/lambda-stack";
import {ApiGatewayStack} from "../lib/api-stack";
import { SnsTopicStack } from '../lib/sns-topic-stack';
import { SqsStack } from '../lib/sqs-stack';

const app = new cdk.App();

const stage = app.node.tryGetContext("env");

if (["dev"].indexOf(stage) === -1) {
    throw Error("env context not supported");
}

const sharedProps = {
    env: {
        account: process.env.AWS_ACCOUNT_ID,
        region: process.env.AWS_ACCOUNT_REGION,
    },
    stageName: stage
}

const kitchenTopic = new SnsTopicStack(app, 'snsTopicStack', {
    ...sharedProps,
    displayName: 'kitchen-topic'
});

const kitchenQueue = new SqsStack(app, 'sqsStack', {
    ...sharedProps,
    queueName: 'order-queue',
    notifier: kitchenTopic
});

const lambdaRestaurantFree = new LambdaStack(app, 'lambdaStack', {
    ...sharedProps,
    snsTopic: kitchenTopic,
    sqsQueue: kitchenQueue
});

new ApiGatewayStack(app, 'apiStack', {
    ...sharedProps,
    lambdaStack: lambdaRestaurantFree
});
