import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import SQSWrapper from '@libs/wrappers/sqs';

const hello: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {

  const client = new SQSWrapper();

  const messages = await client.recieveObject();

  console.log(JSON.stringify(messages));

  return formatJSONResponse({
    message: `Hello consumer`,
    messages
  });
}

export const main = middyfy(hello);
