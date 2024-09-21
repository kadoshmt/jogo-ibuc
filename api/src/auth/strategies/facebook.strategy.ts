/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { RegisterProviderUseCase } from '../use-cases/register-provider.usecase';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly registerProviderUseCase: RegisterProviderUseCase,
  ) {
    super({
      clientID: process.env.FACEBOOK_APP_ID || 'FACEBOOK_APP_ID',
      clientSecret: process.env.FACEBOOK_APP_SECRET || 'FACEBOOK_APP_SECRET',
      callbackURL: process.env.FACEBOOK_REDIRECT_URI,
      profileFields: ['id', 'emails', 'name', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ): Promise<any> {
    const { id, emails, displayName, name, photos } = profile;

    if (!emails || !emails[0].value) {
      throw new BadRequestException(
        'O Facebook não retornou nenhum e-mail válido.',
      );
    }

    if (!displayName || !name || !name.givenName) {
      throw new BadRequestException(
        'O Facebook não retornou nenhum nome ou sobrenome válidos.',
      );
    }

    // Obter o nome completo
    const fullName =
      displayName ||
      `${name.givenName} ${name.middleName || ''} ${name.familyName || ''}`.trim();

    const email = emails[0].value;
    const username = email
      ? email.split('@')[0]
      : name?.givenName || `user_${Math.floor(Math.random() * 10000)}`;
    const avatarUrl = photos && photos.length ? photos[0].value : null;

    const registeredUser = await this.registerProviderUseCase.execute({
      email,
      username,
      name: fullName,
      avatarUrl: avatarUrl ?? '',
      provider: 'facebook',
      providerId: id,
    });

    done(null, registeredUser);
  }
}
