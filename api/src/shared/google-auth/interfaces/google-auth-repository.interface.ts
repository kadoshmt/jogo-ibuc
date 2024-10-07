import { OAuthToken } from '@prisma/client';
import { GoogleToken } from './google-token.interface';

export interface IGoogleAuthRepository {
  getTokens(): Promise<OAuthToken | null>;
  createOrUpdateTokens(data: GoogleToken): Promise<OAuthToken>;
}
