import { UploadParams, Uploader } from './interfaces/uploader.interface';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import { randomUUID } from 'node:crypto';

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client;

  constructor() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    );

    // Construir a URL pública
    const url = `${process.env.R2_PUBLIC_URL}${uniqueFileName}`;

    return {
      url,
    };
  }
}
