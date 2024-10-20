import { Injectable } from '@nestjs/common';
import { OAuthToken } from '@prisma/client';
import { PrismaService } from '@shared/database/prisma.service';

import { IGoogleAuthRepository } from '../interfaces/google-auth-repository.interface';
import { GoogleToken } from '../interfaces/google-token.interface';

@Injectable()
export class PrismaGoogleAuthRepository implements IGoogleAuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getTokens(): Promise<OAuthToken | null> {
    return this.prismaService.oAuthToken.findUnique({ where: { id: 1 } });
  }

  async createOrUpdateTokens(data: GoogleToken): Promise<OAuthToken> {
    const { accessToken, refreshToken, expiresAt } = data;
    const savedToken = await this.prismaService.oAuthToken.upsert({
      where: { id: 1 }, // Presumindo que há apenas um registro de token
      update: {
        accessToken,
        refreshToken,
        expiresAt,
      },
      create: {
        id: 1,
        accessToken,
        refreshToken,
        expiresAt,
      },
    });

    return savedToken;
  }
}
