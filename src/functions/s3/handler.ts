import 'source-map-support/register';

import { formatJSONResponse, ValidatedEventFileGatewayProxyEvent } from '@libs/apiGateway';
import middy from '@middy/core';
import multipartBodyParser from '@middy/http-multipart-body-parser';
import { errorMiddleware } from '../../libs/middleware';
import S3Wrapper from '@libs/wrappers/s3';

// Note: This lamda creates and also updates provided that the same file name is used
const s3Upsert: ValidatedEventFileGatewayProxyEvent = async (event) => {

  const s3Client = new S3Wrapper();

  // TODO: Get request which returns a signed url which expires after 2 mins

  // Determine whether to insert or to update
  let response: Record<string, unknown>;
  if (event.httpMethod === 'POST') {
    response = await s3Client.createObject(event.body.file.content, event.body.file.filename) as unknown as Record<string, unknown>
  } else {
    // Either PATCH or DELETE
    const fileId = event.pathParameters['key'];
    if (event.httpMethod === 'PATCH') {
      response = await s3Client.updateObject(event.body.file.content, fileId) as unknown as Record<string, unknown>;
    } else {
      await s3Client.deleteObject(fileId);
      response = null;
    }
  }

  // Return action response with correct code
  return formatJSONResponse(response, (response === null ? 204 : 200));

}

export const main = middy(s3Upsert).use(multipartBodyParser()).use(errorMiddleware); // Use multipart body parser
