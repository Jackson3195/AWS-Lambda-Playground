import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import SQSWrapper from '@libs/wrappers/sqs';


const hello: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {

  const client = new SQSWrapper();

  const response = await client.queueObject({'Hello': 'World'});

  return formatJSONResponse({
    message: `Hello from queue inserter`,
    response
  });
}

export const main = middyfy(hello);
