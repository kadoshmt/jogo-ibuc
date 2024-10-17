import { UploadParams, Uploader } from './interfaces/uploader.interface';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class R2StorageService implements Uploader {
  private client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    this.bucketName = process.env.R2_BUCKET_NAME as string;
    this.publicUrl = process.env.R2_PUBLIC_URL as string;

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
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
        Bucket: this.bucketName,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    );

    // Assegura que a URL pública termina com '/'
    const baseUrl = this.publicUrl.endsWith('/')
      ? this.publicUrl
      : `${this.publicUrl}/`;
    const url = `${baseUrl}${uniqueFileName}`;

    return { url };
  }

  async delete(url: string): Promise<void> {
    const uniqueFileName = this.extractFileNameFromUrl(url);

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: uniqueFileName,
      }),
    );
  }

  async fileExists(url: string): Promise<boolean> {
    const uniqueFileName = this.extractFileNameFromUrl(url);

    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: uniqueFileName,
        }),
      );
      return true;
    } catch (error) {
      if (
        error.name === 'NotFound' ||
        error['$metadata']?.httpStatusCode === 404
      ) {
        return false;
      } else {
        throw error;
      }
    }
  }

  private extractFileNameFromUrl(url: string): string {
    const baseUrl = this.publicUrl.endsWith('/')
      ? this.publicUrl
      : `${this.publicUrl}/`;

    if (url.startsWith(baseUrl)) {
      return url.substring(baseUrl.length);
    } else {
      throw new Error('URL inválida');
    }
  }

  isOwnStorageUrl(url: string): boolean {
    const baseUrl = this.publicUrl.endsWith('/')
      ? this.publicUrl
      : `${this.publicUrl}/`;

    return url.startsWith(baseUrl);
  }
}
