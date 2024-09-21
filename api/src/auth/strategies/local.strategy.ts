import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../use-cases/login.usecase';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super({ usernameField: 'email' }); // Define o campo de usuário como 'email'
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.loginUseCase.execute(email, password);
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }
    return user;
  }
}
