import { randomUUID } from 'node:crypto';
import { Uploader, UploadParams } from './interfaces/uploader.interface';

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const file = randomUUID();

    this.uploads.push({
      fileName,
      url: file,
    });

    const url = `${process.env.R2_PUBLIC_URL}${file}`;

    return { url };
  }
}
