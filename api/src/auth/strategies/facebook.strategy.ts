/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Role } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private usersService: UsersService) {
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
    let username = email
      ? email.split('@')[0]
      : name?.givenName || `user_${Math.floor(Math.random() * 10000)}`;
    const avatar = photos && photos.length ? photos[0].value : null;

    let user = await this.usersService.findOneByFacebookId(id);
    if (!user) {
      // Verifica se o username já está em uso
      const existingUsername =
        await this.usersService.findOneByUsername(username);
      if (existingUsername) {
        username = `${username}_${Math.floor(Math.random() * 10000)}`;
      }

      // Verifica se há um usuário com o mesmo e-mail
      user = email ? await this.usersService.findOneByEmail(email) : null;
      if (user) {
        // Atualiza o facebookId do usuário existente
        user = await this.usersService.updateUser(user.id, {
          facebookId: id,
          avatar,
        });
      } else {
        const createUserDto: CreateUserDto = {
          email,
          username,
          name: fullName,
          microsoftId: id,
          avatar: avatar ?? undefined,
          role: Role.PLAYER,
        };

        user = await this.usersService.createUser(createUserDto);
      }
    }

    done(null, user);
  }
}
