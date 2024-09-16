// src/auth/microsoft.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: process.env.MICROSOFT_REDIRECT_URI,
      scope: ['user.read'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    done: Function,
  ): Promise<any> {
    const { id, displayName, userPrincipalName, emails } = profile;
    const email = emails && emails.length ? emails[0] : userPrincipalName;

    // Verifica se o usuário já existe
    let user = await this.usersService.findOneByMicrosoftId(id);
    if (!user) {
      // Se não existir, verifica se há um usuário com o mesmo e-mail
      user = await this.usersService.findOneByEmail(email);
      if (user) {
        // Atualiza o microsoftId do usuário existente
        user = await this.usersService.updateUser(user.id, {
          microsoftId: id,
        });
      } else {
        // Se não existir, cria um novo usuário
        user = await this.usersService.createUser({
          email,
          firstName: displayName.split(' ')[0],
          lastName: displayName.split(' ').slice(1).join(' '),
          microsoftId: id,
        });
      }
    }

    done(null, user);
  }
}
