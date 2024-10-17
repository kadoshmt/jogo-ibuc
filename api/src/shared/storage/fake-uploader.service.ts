import { Injectable } from '@nestjs/common';
import { Uploader, UploadParams } from './interfaces/uploader.interface';

interface Upload {
  fileName: string;
  url: string;
}

@Injectable()
export class FakeUploaderService implements Uploader {
  public uploads: Upload[] = [];
  private baseUrl = 'https://fake-storage.com';

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = `${this.baseUrl}/${fileName}`;
    this.uploads.push({ fileName, url });
    return { url };
  }

  async delete(url: string): Promise<void> {
    this.uploads = this.uploads.filter((upload) => upload.url !== url);

    // Opcionalmente, lance um erro se o arquivo não for encontrado
    // else {
    //   throw new Error('Arquivo não encontrado');
    // }
  }

  async fileExists(url: string): Promise<boolean> {
    return this.uploads.some((upload) => upload.url === url);
  }

  isOwnStorageUrl(url: string): boolean {
    return url.startsWith(this.baseUrl);
  }
}
