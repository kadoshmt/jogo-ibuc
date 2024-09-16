import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuizController } from './quiz/quiz.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController, QuizController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Primeiro o AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Depois o RolesGuard
    },
    AppService,
  ],
})
export class AppModule {}
