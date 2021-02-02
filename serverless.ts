import type { AWS } from '@serverless/typescript';

import { hello, s3, dynamo, queueInsert, queueConsumer, spreadsheet } from './src/functions';

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
    region: 'eu-west-1',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      AWS_CUSTOM_REGION: 'eu-west-1',
      AWS_CUSTOM_ACCESS_KEY: process.env['AWS_ACCESS_KEY'],
      AWS_CUSTOM_ACCESS_SECRET_KEY: process.env['AWS_ACCESS_KEY']
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    hello,
    s3,
    dynamo,
    queueInsert,
    queueConsumer,
    spreadsheet
  }
}

module.exports = serverlessConfiguration;
