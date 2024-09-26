import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3030);
  app.enableCors({
    origin: 'http://localhost:3000', // Seu domínio Next.js
    credentials: true,
  });
}
bootstrap();
