// src/auth/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { CreateUserDto } from 'src/users/dto/create-user.dto';
// import { Role } from 'src/users/interfaces/user.interface';
//import { UsersService } from 'src/users/users.service';
import { GoogleProfile } from '../interfaces/google-profile.interface';
// import { RegisterUseCase } from '../use-cases/register.usecase';
import { RegisterProviderUseCase } from '../use-cases/register-provider.usecase';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    //private usersService: UsersService,
    private readonly registerProviderUseCase: RegisterProviderUseCase,
  ) {
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
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, displayName, name, photos } = profile;
    const email = emails[0].value;
    // const verified = emails[0].verified;
    const username = email.split('@')[0]; // Pega o que está antes do '@' no e-mail
    const avatar = photos[0].value; // URL da imagem de avatar

    // Obter o nome completo
    const fullName =
      displayName || `${name.givenName} ${name.familyName || ''}`.trim();

    //let user = await this.usersService.findOneByGoogleId(id);
    // if (!user) {
    //   // Verifica se o username já está em uso
    //   const existingUsername =
    //     await this.usersService.findOneByUsername(username);
    //   if (existingUsername) {
    //     // Gera um username único adicionando um sufixo
    //     username = `${username}_${Math.floor(Math.random() * 10000)}`;
    //   }

    //   // Verifica se há um usuário com o mesmo e-mail
    //   user = await this.usersService.findOneByEmail(email);
    //   if (user) {
    //     // Atualiza o googleId do usuário existente
    //     user = await this.usersService.updateUser(user.id, {
    //       googleId: id,
    //       avatar,
    //     });
    //   } else {
    //     // Cria um novo usuário
    //     const createUserDto: CreateUserDto = {
    //       email,
    //       username,
    //       name: fullName,
    //       googleId: id,
    //       avatar,
    //       role: Role.PLAYER,
    //     };

    //     user = await this.usersService.createUser(createUserDto);
    //   }
    // }

    const registeredUser = await this.registerProviderUseCase.execute({
      email,
      username,
      name: fullName,
      avatar,
      provider: 'google',
      providerId: id,
    });

    done(null, registeredUser);
  }
}
