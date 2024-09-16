import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Role } from './user.interface';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient();

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    googleId?: string;
    microsoftId?: string;
    role?: Role;
  }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findOneByGoogleId(googleId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  async findOneByMicrosoftId(microsoftId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { microsoftId },
    });
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(
        'Usuário não encontrado ou não autenticado',
      );
    }

    // Gera o hash SHA-256 do refresh token recebido
    const sha256Hash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // Comparar o refreshToken original com o hash armazenado
    const isMatch = await bcrypt.compareSync(sha256Hash, user.refreshToken);

    if (isMatch) {
      return user;
    } else {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
