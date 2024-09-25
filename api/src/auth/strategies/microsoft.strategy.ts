/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { RegisterProviderUseCase } from '../use-cases/register-provider.usecase';
import { getAvatarUrl } from 'src/common/utils/avatar.util';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    private readonly registerProviderUseCase: RegisterProviderUseCase,
  ) {
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
    done: Function,
  ): Promise<any> {
    const { id, displayName, userPrincipalName, emails, photos } = profile;
    // Garante que o email seja sempre uma string, usando userPrincipalName como fallback
    const email =
      emails && emails.length ? emails[0].value : userPrincipalName || '';
    const username = email.split('@')[0]; // Pega o que está antes do '@' no e-mail
    const avatarUrl = photos && photos.length ? photos[0] : null;

    const registeredUser = await this.registerProviderUseCase.execute({
      email,
      username,
      name: displayName,
      avatarUrl: avatarUrl ?? getAvatarUrl(null),
      provider: 'microsoft',
      providerId: id,
      newsletter: true,
    });

    done(null, registeredUser);
  }
}
