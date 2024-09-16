// src/auth/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, // Substitua pelo seu Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Substitua pelo seu Client Secret
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails } = profile;
    const email = emails[0].value;

    // Verifica se o usuário já existe
    let user = await this.usersService.findOneByGoogleId(id);
    if (!user) {
      // Se não existir, verifica se há um usuário com o mesmo e-mail
      user = await this.usersService.findOneByEmail(email);
      if (user) {
        // Atualiza o googleId do usuário existente
        user = await this.usersService.updateUser(user.id, {
          googleId: id,
        });
      } else {
        // Se não existir, cria um novo usuário
        user = await this.usersService.createUser({
          email,
          firstName: name.givenName,
          lastName: name.familyName,
          googleId: id,
        });
      }
    }

    done(null, user);
  }
}
