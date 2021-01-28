import middy from '@middy/core'

export const middleware1: middy.MiddlewareObject<any, any, any> = {
    before: (_handler, next) => {
        next();
    },
    after: (_handler, next) => {
        next();
    },
    onError: (_handler, next) => {
        next();
    }
}

export const errorMiddleware: middy.MiddlewareObject<any, any, any> = {
    onError: (handler, next) => {
        // Error parsing
        if (handler.error !== undefined) {
            // Create error handling payload
            const payload = {
                errors: [
                    {
                        name: handler.error.name || 'Name not specified',
                        message: handler.error.message || 'Message not specified',
                        stack: handler.error.stack || 'Stack not specified'
                    }
                ],
                context: handler.event.body
            };
            // Update response
            handler.response = {
                statusCode: 400,
                body: JSON.stringify(payload)
            }
        }
        next();
    }
}

export const middleware3: middy.MiddlewareObject<any, any, any> = {
    before: (_handler, next) => {
        next();
    },
    after: (_handler, next) => {
        next();
    },
    onError: (_handler, next) => {
        next();
    }
}
