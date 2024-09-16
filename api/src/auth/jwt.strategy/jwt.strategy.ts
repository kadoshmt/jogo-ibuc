import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Opcional: se quiser ignorar a expiração do token
      secretOrKey: process.env.JWT_SECRET_KEY, // Use uma variável de ambiente em produção
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.usersService.findOneByEmail(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    // Anexa o papel do usuário
    user.role = payload.role;
    return user;
  }
}
