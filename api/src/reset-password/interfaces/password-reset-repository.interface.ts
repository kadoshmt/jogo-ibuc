import { CreatePasswordResetTokenDTO } from '../dtos/create-password-reset-token.dto';
import { IPasswordReset } from './password-reset.interface';

export interface IPasswordResetRepository {
  findOneByToken(token: string): Promise<IPasswordReset | null>;
  createToken(data: CreatePasswordResetTokenDTO): Promise<IPasswordReset>;
  invalidateToken(token: string): Promise<boolean>;
}
