import type { AWS } from '@serverless/typescript';

import { hello, s3, dynamo, queueInsert, queueConsumer } from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'aws-ts-api',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      AWS_REGION: 'eu-west-1',
      AWS_ACCESS_KEY: '[HIDDEN]',
      AWS_ACCESS_SECRET_KEY: '[HIDDEN]'
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { hello, s3, dynamo, queueInsert, queueConsumer }
}

module.exports = serverlessConfiguration;
