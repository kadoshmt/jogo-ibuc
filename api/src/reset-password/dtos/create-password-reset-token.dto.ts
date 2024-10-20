export interface CreatePasswordResetTokenDTO {
  userId: string;
  token: string;
  expiresAt: Date;
}
