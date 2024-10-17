import { Injectable } from '@nestjs/common';

import { ResetPasswordTokens } from '@prisma/client';
import { PrismaService } from 'src/shared/database/prisma.service';
import { IPasswordResetRepository } from '../interfaces/password-reset-repository.interface';
import { IPasswordReset } from '../interfaces/password-reset.interface';
import { CreatePasswordResetTokenDTO } from '../dtos/create-password-reset-token.dto';

@Injectable()
export class PrismaPasswordResetRepository implements IPasswordResetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByToken(token: string): Promise<IPasswordReset | null> {
    return this.prisma.resetPasswordTokens.findFirst({
      where: { token },
    });
  }

  async createToken(
    data: CreatePasswordResetTokenDTO,
  ): Promise<ResetPasswordTokens> {
    return this.prisma.resetPasswordTokens.create({
      data: {
        userId: data.userId as string,
        token: data.token,
        expiresAt: data.expiresAt,
        used: false,
      },
    });
  }

  async invalidateToken(token: string): Promise<boolean> {
    const tokenDatabase = await this.findOneByToken(token);
    const updatedToken = await this.prisma.resetPasswordTokens.update({
      where: { id: tokenDatabase?.id },
      data: { used: true },
    });
    return updatedToken.used;
  }
}
