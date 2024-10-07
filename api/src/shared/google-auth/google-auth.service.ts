import { Inject, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
// import { PrismaClient } from '@prisma/client';
import { encrypt, decrypt } from 'src/common/utils/crypto-util';
import { IGoogleAuthRepository } from './interfaces/google-auth-repository.interface';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class GoogleAuthService {
  private oauth2Client: OAuth2Client;
  private readonly prisma: PrismaService;

  constructor(
    @Inject('IGoogleAuthRepository')
    private readonly googleAuthRepository: IGoogleAuthRepository,
  ) {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI =
      process.env.GMAIL_REDIRECT_URI ||
      'http://localhost:3030/auth/gmail/redirect';

    this.oauth2Client = new OAuth2Client(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI,
    );

    // Inicializa o PrismaClient
    //this.prisma = new PrismaClient();
  }

  generateAuthUrl(): string {
    const scopes = ['https://mail.google.com/'];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline', // Necessário para obter o refresh token
      scope: scopes,
      prompt: 'consent', // Garante que o usuário seja solicitado a consentir novamente
    });
  }

  async getTokens(code: string): Promise<any> {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  async storeTokens(tokens: any): Promise<void> {
    const encryptedRefreshToken = encrypt(tokens.refresh_token);
    const encryptedAccessToken = encrypt(tokens.access_token);

    // Calcula a data de expiração do access token
    const expiresAt = tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + tokens.expires_in * 1000);

    await this.googleAuthRepository.createOrUpdateTokens({
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      expiresAt: expiresAt,
    });

    // await this.prisma.oAuthToken.upsert({
    //   where: { id: 1 }, // Presumindo que há apenas um registro de token
    //   update: {
    //     accessToken: encryptedAccessToken,
    //     refreshToken: encryptedRefreshToken,
    //     expiresAt: expiresAt,
    //   },
    //   create: {
    //     id: 1,
    //     accessToken: encryptedAccessToken,
    //     refreshToken: encryptedRefreshToken,
    //     expiresAt: expiresAt,
    //   },
    // });
  }

  async getCredentials(): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const tokenRecord = await this.googleAuthRepository.getTokens();

    if (!tokenRecord) {
      throw new Error('Access token not found');
    }

    const REFRESH_TOKEN = decrypt(tokenRecord.refreshToken);
    let ACCESS_TOKEN = decrypt(tokenRecord.accessToken);

    // const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    // const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    // const REDIRECT_URI =
    //   process.env.GMAIL_REDIRECT_URI ||
    //   'http://localhost:3030/auth/gmail/redirect';

    this.oauth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN,
      access_token: ACCESS_TOKEN,
    });

    // Verifica se o access token expirou
    const isAccessTokenExpired = tokenRecord.expiresAt < new Date();

    if (isAccessTokenExpired) {
      // Obtém um novo access token usando o refresh token
      const accessTokenResponse = await this.oauth2Client.getAccessToken();
      const accessToken = accessTokenResponse.token;

      if (!accessToken) {
        throw new Error('Failed to create access token');
      }

      // Atualiza o access token e a data de expiração no banco de dados
      const expiresAt = new Date(Date.now() + 3600 * 1000); // Access token geralmente expira em 1 hora

      await this.googleAuthRepository.createOrUpdateTokens({
        refreshToken: tokenRecord.refreshToken,
        accessToken: encrypt(accessToken),
        expiresAt: expiresAt,
      });

      // await this.prisma.oAuthToken.update({
      //   where: { id: tokenRecord.id },
      //   data: {
      //     accessToken: encrypt(accessToken),
      //     expiresAt: expiresAt,
      //   },
      // });

      // Atualiza o access token em memória
      ACCESS_TOKEN = accessToken;

      // Atualiza as credenciais do OAuth2Client
      this.oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN,
        access_token: ACCESS_TOKEN,
      });
    }

    return {
      accessToken: ACCESS_TOKEN,
      refreshToken: REFRESH_TOKEN,
    };
  }
}
