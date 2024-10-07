export interface GoogleToken {
  id?: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
