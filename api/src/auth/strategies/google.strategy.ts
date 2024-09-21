import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleProfile } from '../interfaces/google-profile.interface';
import { RegisterProviderUseCase } from '../use-cases/register-provider.usecase';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly registerProviderUseCase: RegisterProviderUseCase,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, displayName, name, photos } = profile;

    const email = emails[0].value;
    const username = email.split('@')[0]; // Pega o que está antes do '@' no e-mail
    const avatarUrl = photos[0].value.replace('=s96-c', ''); // URL da imagem de avatar sem o limitador de tamanho

    // Obter o nome completo
    const fullName =
      displayName || `${name.givenName} ${name.familyName || ''}`.trim();

    const registeredUser = await this.registerProviderUseCase.execute({
      email,
      username,
      name: fullName,
      avatarUrl,
      provider: 'google',
      providerId: id,
    });

    done(null, registeredUser);
  }
}
