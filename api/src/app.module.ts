import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TestRolesController } from './test-roles/test-roles.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './common/exceptions/throttler-limit.exception';
import { ProfileModule } from './profile/profile.module';
import { PrismaModule } from './shared/database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // Tempo de vida em milisegundos
          limit: 10, // Número máximo de requisições permitidas por cliente
        },
      ],
    }),
    CacheModule.register({
      ttl: 120, // Tempo de expiração do cache em segundos (2 minutos)
      isGlobal: true, // Opcional: torna o cache global para todos os módulos
    }),
    AuthModule,
    ProfileModule,
    UsersModule,
  ],
  controllers: [AppController, TestRolesController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Primeiro o AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Depois o RolesGuard
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard, // Aplica o throttler a todas as rotas
    },
    AppService,
  ],
})
export class AppModule {}
