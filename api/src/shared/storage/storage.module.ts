import { Module } from '@nestjs/common';
// import { R2Storage } from './r2-storage';
import { Uploader } from './interfaces/uploader.interface';
import { R2StorageService } from './r2-storage.service';

@Module({
  providers: [
    {
      provide: Uploader,
      useClass: R2StorageService,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
