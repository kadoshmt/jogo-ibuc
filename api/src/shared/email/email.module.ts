import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { GoogleAuthModule } from '@shared/google-auth/google-auth.module';

@Module({
  providers: [EmailService],
  exports: [EmailService],
  imports: [GoogleAuthModule],
})
export class EmailModule {}
