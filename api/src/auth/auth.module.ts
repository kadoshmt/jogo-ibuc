import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { UsersService } from 'src/users/users.service';
import { LocalStrategy } from './strategies/local.strategy';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { UserPrismaRepository } from 'src/users/repositories/user-prisma.repository';

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
    FacebookStrategy,
    {
      provide: 'IUserRepository',
      useClass: UserPrismaRepository,
    },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
