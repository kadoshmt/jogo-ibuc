import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Users } from '@prisma/client';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Opcional: se quiser ignorar a expiração do token
      secretOrKey: process.env.JWT_SECRET_KEY, // Use uma variável de ambiente em produção
    });
  }

  async validate(payload: any): Promise<Users> {
    const user = await this.userRepository.findOneByEmail(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    // Anexa o papel do usuário
    user.role = payload.role;
    return user;
  }
}
