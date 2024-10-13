import { Module } from '@nestjs/common';
import { R2Storage } from './r2-storage';
import { Uploader } from './interfaces/uploader.interface';

@Module({
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
