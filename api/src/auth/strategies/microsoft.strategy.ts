/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { RegisterProviderUseCase } from '../use-cases/register-provider.usecase';
// import { CreateUserDto } from 'src/users/dto/create-user.dto';
// import { Role } from 'src/users/interfaces/user.interface';
//import { UsersService } from 'src/users/users.service';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    //private usersService: UsersService,
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
    const email = emails && emails.length ? emails[0] : userPrincipalName;
    const username = email.split('@')[0]; // Pega o que está antes do '@' no e-mail
    const avatarUrl = photos && photos.length ? photos[0] : null;

    // let user = await this.usersService.findOneByMicrosoftId(id);
    // if (!user) {
    //   // Verifica se o username já está em uso
    //   const existingUsername =
    //     await this.usersService.findOneByUsername(username);
    //   if (existingUsername) {
    //     username = `${username}_${Math.floor(Math.random() * 10000)}`;
    //   }

    //   // Verifica se há um usuário com o mesmo e-mail
    //   user = await this.usersService.findOneByEmail(email);
    //   if (user) {
    //     // Atualiza o microsoftId do usuário existente
    //     user = await this.usersService.updateUser(user.id, {
    //       microsoftId: id,
    //       avatarUrl,
    //     });
    //   } else {
    //     const createUserDto: CreateUserDto = {
    //       email,
    //       username,
    //       name: displayName,
    //       microsoftId: id,
    //       avatarUrl,
    //       role: Role.JOGADOR,
    //     };

    //     user = await this.usersService.createUser(createUserDto);
    //   }
    // }

    const registeredUser = await this.registerProviderUseCase.execute({
      email,
      username,
      name: displayName,
      avatarUrl,
      provider: 'microsoft',
      providerId: id,
    });

    done(null, registeredUser);
  }
}
