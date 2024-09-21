import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { RegisterUseCase } from './use-cases/register.usecase';
import { GenerateAccessTokenUseCase } from './use-cases/generate-access-token.usecase';
import { RegisterProviderUseCase } from './use-cases/register-provider.usecase';
import { SharedModule } from 'src/shared/shared.module';
import { LoginUseCase } from './use-cases/login.usecase';
import { ValidateUserUseCase } from './use-cases/validade-user.usecase';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }, // Tempo de expiração do token
    }),
    SharedModule,
  ],
  providers: [
    JwtStrategy,
    LocalStrategy,
    LocalAuthGuard,
    GoogleStrategy,
    MicrosoftStrategy,
    FacebookStrategy,
    RegisterUseCase,
    RegisterProviderUseCase,
    GenerateAccessTokenUseCase,
    LoginUseCase,
    ValidateUserUseCase,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
