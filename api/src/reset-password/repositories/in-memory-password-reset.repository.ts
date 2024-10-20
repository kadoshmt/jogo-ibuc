// in-memory-password-reset.repository.ts

import { CreatePasswordResetTokenDTO } from '../dtos/create-password-reset-token.dto';
import { IPasswordResetRepository } from '../interfaces/password-reset-repository.interface';
import { IPasswordReset } from '../interfaces/password-reset.interface';

export class InMemoryPasswordResetRepository
  implements IPasswordResetRepository
{
  private tokens: IPasswordReset[] = [];

  async findOneByToken(token: string): Promise<IPasswordReset | null> {
    return this.tokens.find((t) => t.token === token) || null;
  }

  async createToken(
    data: CreatePasswordResetTokenDTO,
  ): Promise<IPasswordReset> {
    const newToken: IPasswordReset = {
      id: (this.tokens.length + 1).toString(), // Simulando IDs incrementais
      userId: data.userId,
      token: data.token,
      expiresAt: data.expiresAt,
      used: false,
      createdAt: new Date(),
    };
    this.tokens.push(newToken);
    return newToken;
  }

  async invalidateToken(id: string): Promise<boolean> {
    const token = this.tokens.find((t) => t.token === id);
    if (token) {
      token.used = true;
      return true;
    }
    return false;
  }
}
