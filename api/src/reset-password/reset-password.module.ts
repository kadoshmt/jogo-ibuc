import { Module } from '@nestjs/common';
import { PrismaPasswordResetRepository } from './repositories/prisma-password-reset.repository';
import { ResetPasswordController } from './reset-password.controller';
import { SharedModule } from '@shared/shared.module';
import { RequestPasswordResetUseCase } from './usecases/request-password-reset.usecase';
import { ResetPasswordUseCase } from './usecases/reset-password.usecase';

@Module({
  imports: [SharedModule],
  controllers: [ResetPasswordController],
  providers: [
    {
      provide: 'IPasswordResetRepository',
      useClass: PrismaPasswordResetRepository,
    },
    RequestPasswordResetUseCase,
    ResetPasswordUseCase,
  ],
  //exports: ['IPasswordResetRepository'],
})
export class ResetPasswordModule {}
