import { S3 } from 'aws-sdk';
import { createHash } from 'crypto';
import { fromBuffer as GetFileMetadata } from 'file-type';
import { GetSharedAWSConfig } from './shared';

export default class S3Wrapper {

    private client: S3;
    private bucket: string = 'jackson-testing';

    constructor () {
        // Create new S3 client for reuse
        this.client = new S3(GetSharedAWSConfig());
    }

    public async createObject (body: Buffer, name: string) {
        const fileInfo = await GetFileMetadata(body);
        const hash = createHash('md5').update(name).digest('hex');

        const newFileName = hash + '.' + fileInfo.ext;

        const params: S3.PutObjectRequest = {
            ACL: 'public-read',
            Body: body,
            ContentType: fileInfo.mime,
            Bucket: this.bucket,
            Key: newFileName
        }
        return this.client.upload(params).promise();
    }

    public async updateObject (body: Buffer, name: string) {
        const fileInfo = await GetFileMetadata(body);

        // Strip old extention incase you are literally changing the file type
        const regexExtention = new RegExp(/(\.[A-Za-z0-9]*)/gm);
        const strippedName = name.replace(regexExtention, '');
        const newFileName = strippedName + '.' + fileInfo.ext;

        // Delete old object (Clean up)
        await this.deleteObject(name);

        // Create new object (Recreate to handle edge cases where x2 of the updated object already exists...)
        const createParams: S3.PutObjectRequest = {
            ACL: 'public-read',
            Body: body,
            ContentType: fileInfo.mime,
            Bucket: this.bucket,
            Key: newFileName
        }
        return this.client.upload(createParams).promise();
    }

    public async deleteObject (name: string) {
        const deleteParams: S3.DeleteObjectRequest = {
            Bucket: this.bucket,
            Key: name
        }
        return this.client.deleteObject(deleteParams).promise();
    }

}