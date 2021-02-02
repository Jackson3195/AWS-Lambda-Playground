import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>, statusCode = 200) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(response)
  }
}

type FileBody = {
  filename: string;
  mimetype: string;
  encoding: string;
  truncated: boolean;
  content: Buffer;
}

type FileAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: Record<string, S> };
export type ValidatedEventFileGatewayProxyEvent = Handler<FileAPIGatewayProxyEvent<FileBody>, APIGatewayProxyResult>;