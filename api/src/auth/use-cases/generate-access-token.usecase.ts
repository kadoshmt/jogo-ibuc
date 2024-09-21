import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserJwtPayload } from '../dto/user-jwt-payload.dto';

@Injectable()
export class GenerateAccessTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(user: UserJwtPayload): Promise<string> {
    const payload = { username: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return accessToken;
  }
}
