// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Valida o usuário por e-mail e senha
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m', // Token de acesso válido por 15 minutos
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh token válido por 7 dias
    });

    // Gera um hash SHA-256 do refresh token antes de passar para o bcrypt
    // O brcrypt tem uma limitação de 72 caracteres
    const sha256Hash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // Salva o refresh token no banco de dados (hash por segurança)
    const hashedRefreshToken = await bcrypt.hash(sha256Hash, 10);

    await this.usersService.updateUser(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number) {
    // Remove o refresh token do usuário
    await this.usersService.updateUser(userId, { refreshToken: null });
  }

  // Método para validar e renovar o access token
  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOneByEmail(payload.username);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      return this.login(user);
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
