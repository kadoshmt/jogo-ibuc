export interface UploadParams {
  fileName: string;
  fileType: string;
  body: Buffer;
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ url: string }>;
  abstract delete(url: string): Promise<void>;
  abstract fileExists?(url: string): Promise<boolean>;
  abstract isOwnStorageUrl(url: string): boolean;
}
