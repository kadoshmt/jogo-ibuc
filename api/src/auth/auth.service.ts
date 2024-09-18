/* eslint-disable @typescript-eslint/no-unused-vars */
// src/auth/auth.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
// import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/users/interfaces/user.interface';
import { EmailConflictException } from 'src/common/exceptions/email-conflict.exception';
import { UsernameConflictException } from 'src/common/exceptions/username-conflict.exception';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // Valida o usuário por e-mail e senha
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async register(userForm: RegisterDto): Promise<UserResponseDto> {
    const { email, password, name, username } = userForm;

    // Verifica se o e-mail já está registrado
    const existingEmail = await this.usersService.findOneByEmail(email);
    if (existingEmail) {
      throw new EmailConflictException();
    }

    // Verifica se o username já está em uso
    const existingUsername =
      await this.usersService.findOneByUsername(username);
    if (existingUsername) {
      throw new UsernameConflictException();
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const user = await this.usersService.createUser({
      email,
      username,
      password: hashedPassword,
      name,
    });

    // Retorna o objeto transformado para o DTO de resposta
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    };
  }

  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { username: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h', // Ajuste o tempo de expiração conforme necessário
    });

    return {
      accessToken,
    };
  }

  // async logout(userId: number) {
  //   // Com a remoção do refreshToken, não há necessidade de manipular o logout
  //   // Você pode implementar uma lista de revogação no futuro, se necessário
  // }
}
