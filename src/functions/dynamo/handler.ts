import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import DynamoWrapper from '@libs/wrappers/dynamo';
 
// Note: This lamda creates and also updates provided that the same file name is used
const dynamo: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {

  const dynamoClient = new DynamoWrapper();
  // Get item from dynamp
  if (event.httpMethod === 'POST') {
    await dynamoClient.createItem('User', event.body);
    return formatJSONResponse(event.body, 201);
  } else {
    const id = event.pathParameters['id'];
    // Determine which pathway to take
    if (event.httpMethod === 'PATCH') {
      // UPDATE
      const response = await dynamoClient.updateItem('User', id, event.body);
      return formatJSONResponse(response);
    } else if (event.httpMethod === 'DELETE') {
      // DELETE
      await dynamoClient.deleteItem('User', id);
      return formatJSONResponse(null, 204);
    } else {
      // GET
      const response = await dynamoClient.getItem('User', id) as unknown as Record<string, unknown>
      return formatJSONResponse(response);

    }
  }

}

export const main = middyfy(dynamo);
