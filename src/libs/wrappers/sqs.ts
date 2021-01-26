import { SQS } from 'aws-sdk';
import { GetSharedAWSConfig } from './shared';

export default class SQSWrapper {
    private client: SQS;
    private queueURL: string = 'https://sqs.eu-west-1.amazonaws.com/963769743676/testing1';
    
    constructor () {
        // Create a new SQS client
        this.client = new SQS(GetSharedAWSConfig());
    }

    public async queueObject (body: Record<string, unknown>) {
        return this.client.sendMessage(
            {
                QueueUrl: this.queueURL,
                MessageAttributes: {
                    'Type': {
                        'DataType': 'String',
                        StringValue: 'Analytics'
                    },
                    'C1': {
                        'DataType': 'String',
                        StringValue: 'EU'
                    },
                    'C2': {
                        'DataType': 'String',
                        StringValue: 'UK'
                    },
                    'C3': {
                        'DataType': 'String',
                        StringValue: 'Buckinghamshire'
                    },
                    'C4': {
                        'DataType': 'String',
                        StringValue: 'High Wycombe'
                    }
                },
                MessageBody: JSON.stringify(body)
            }
        ).promise();
    }

    public async recieveObject () {
        const response = await this.client.receiveMessage(
            {
                QueueUrl: this.queueURL,
                MaxNumberOfMessages: 10,
                MessageAttributeNames: [
                    'All'
                ]
            }
        ).promise();

        if (response.Messages) {
            const messages = response.Messages;
            messages.forEach(async (m) => {
                console.log(m.Body);
                await this.deleteObject(m.ReceiptHandle);
            });
            
            return messages;
        } else {
            return [];
        }
    }

    public deleteObject (handleId: string) {
        return this.client.deleteMessage({
            QueueUrl: this.queueURL,
            ReceiptHandle: handleId
        }).promise();
    }
}

export interface Message {
    MessageId: string;
    ReceiptHandle: string;
    MD5OfBody: string;
    Body: string;
}