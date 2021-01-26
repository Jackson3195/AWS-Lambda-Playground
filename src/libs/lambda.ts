import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import { middleware1, errorMiddleware, middleware3 } from './middleware';

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser()).use(middleware1).use(errorMiddleware).use(middleware3)
}
