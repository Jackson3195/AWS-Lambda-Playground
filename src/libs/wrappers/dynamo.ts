import { DynamoDB } from 'aws-sdk';
import { GetSharedAWSConfig } from './shared';

type KnownTables = 'User';

export default class DynamoWrapper {

    private client: DynamoDB;

    constructor () {
        this.client = new DynamoDB(GetSharedAWSConfig());
    }

    public async getItem (table: KnownTables, id: string) {
        const params: DynamoDB.Types.GetItemInput = {
            TableName: table,
            Key: {
                'id': {
                    S: id
                } 
            }
        }
        const response = await this.client.getItem(params).promise();
        return this.convertDynamoObjectToObject(response.Item as unknown as DynamoDB.Key);
    }

    public createItem (table: KnownTables, body: Record<string, unknown>) {
        return this.client.putItem({
            TableName: table,
            Item: this.convertObjectToDynamoObject(body)
        }).promise();
    }

    public async updateItem (table: KnownTables, id: string, body: Record<string, unknown>) {
        // Get the item
        const oldItem = await this.getItem('User', id);

        // Update the item
        const updatedItem = {
            ...oldItem,
            ...body
        };

        // Set the id
        updatedItem['id'] = id;

        // Put the item (Create uses put under the hood, so we can reuse it)
        await this.createItem(table, updatedItem);

        return updatedItem;
    }

    public deleteItem (table: KnownTables, id: string) {
        return this.client.deleteItem({
            TableName: table,
            Key: {
                id: {
                    'S': id
                }
            }
        }).promise();
    }

    private convertObjectToDynamoObject (jsonObject: Record<string, unknown>) {
        const keys = Object.keys(jsonObject);
        const templateObject: Record<string, unknown> = {};

        for (const key of keys) {
            const value = jsonObject[key];
            switch (typeof value) {
                case 'string':
                    templateObject[key] = {
                        'S': value
                    };
                    break;
                case 'number':
                    templateObject[key] = {
                        'N': value.toString()
                    };
                    break;
                case 'boolean':
                    templateObject[key] = {
                        'BOOL': value
                    }
                    break;
                default:
                    throw new Error(`Unsupported type ${key} has type of ${typeof value}`);
            }
        }

        return templateObject;
    }

    private convertDynamoObjectToObject (dynamoObject: DynamoDB.Types.Key) {
        const keys = Object.keys(dynamoObject);
        const templateObject: Record<string, unknown> = {};

        for (const key of keys) {
            const wrappedValue = dynamoObject[key];
            const innerKeys = Object.keys(wrappedValue);
            for (const innerKey of innerKeys) {
                const value = wrappedValue[innerKey];
                templateObject[key] = value;
            }
        }

        return templateObject;
    }
}