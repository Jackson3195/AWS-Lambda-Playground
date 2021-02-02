import 'source-map-support/register';

import { formatJSONResponse, ValidatedEventFileGatewayProxyEvent } from '@libs/apiGateway';
import middy from '@middy/core';
import multipartBodyParser from '@middy/http-multipart-body-parser';
import { errorMiddleware } from '../../libs/middleware';
import xlsx from 'node-xlsx';


// Note: This lamda creates and also updates provided that the same file name is used
const spreadsheet: ValidatedEventFileGatewayProxyEvent = async (event) => {

  // Extract file from request -> parse into memory -> dump data
  const worksheetFromBuffer = xlsx.parse(event.body.file.content);
  const worksheet = worksheetFromBuffer[0];
  console.log('Filename', worksheet.name);
  console.log('Data', worksheet.data.forEach((d) => {
    console.log(d);
  }));

  // Return action response with correct code
  return formatJSONResponse(null, 200);

}

export const main = middy(spreadsheet).use(multipartBodyParser()).use(errorMiddleware); // Use multipart body parser
