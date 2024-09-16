import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy/google.strategy';
import { UsersService } from 'src/users/users.service';
import { LocalStrategy } from './local.strategy/local.strategy';
import { MicrosoftStrategy } from './microsoft.strategy/microsoft.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Use uma variável de ambiente em produção
      signOptions: { expiresIn: '60s' }, // Tempo de expiração do token
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    MicrosoftStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
