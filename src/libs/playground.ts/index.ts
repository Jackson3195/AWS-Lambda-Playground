import { Context, ScheduledEvent } from 'aws-lambda';

export const eventHandler = <T>(
    event: ScheduledEvent<T>,
    ctx: Context
) => {};

