import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@shared/database/prisma.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { EmailService } from '@src/shared/email/email.service';
import { vi } from 'vitest';
import { RegisterInputDto } from '@src/auth/dtos/register-input.dto';
import { LoggedUserOutputDto } from '@src/auth/dtos/logged-user-output.dto';

describe('ResetPasswordController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let emailService: EmailService;
  let user: LoggedUserOutputDto;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue({
        sendMail: vi.fn().mockResolvedValue(null), // Mock do serviço de e-mail
      })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true }) // Desativa o throttling nos testes
      .compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    emailService = moduleRef.get(EmailService);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  beforeEach(async () => {
    const registerData: RegisterInputDto = {
      email: 'usertest@example.com',
      password: 'password123',
      name: 'User Test',
      username: 'usertest',
      genre: 'MASCULINO',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerData)
      .expect(201);

    user = response.body.user;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  afterEach(async () => {
    await prisma.$transaction([
      prisma.resetPasswordTokens.deleteMany(),
      prisma.profile.deleteMany(),
      prisma.users.deleteMany(),
    ]);
  });

  describe('POST /reset-password/request', () => {
    it('deve solicitar a redefinição de senha com sucesso', async () => {
      const emailData = { email: 'usertest@example.com' };

      // Mock do serviço de e-mail para verificar se ele foi chamado
      const sendMailSpy = vi.spyOn(emailService, 'sendMail');

      return request(app.getHttpServer())
        .post('/reset-password/request')
        .send(emailData)
        .expect(201)
        .expect(() => {
          expect(sendMailSpy).toHaveBeenCalled();
        });
    });

    it('deve retornar erro 400 para e-mail inválido', async () => {
      const invalidEmailData = { email: 'invalid-email' };

      return request(app.getHttpServer())
        .post('/reset-password/request')
        .send(invalidEmailData)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain('email must be an email');
        });
    });

    it('deve retornar erro 404 se o e-mail não for encontrado', async () => {
      const emailData = { email: 'nonexistent@example.com' };

      return request(app.getHttpServer())
        .post('/reset-password/request')
        .send(emailData)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toBe('E-mail não encontrado.');
        });
    });
  });

  describe('POST /reset-password', () => {
    let resetToken: string;

    beforeEach(async () => {
      // Criação do token de redefinição de senha
      resetToken = 'valid-token';
      await prisma.resetPasswordTokens.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60), // Expira em 1 hora
        },
      });
    });

    it('deve redefinir a senha com sucesso', async () => {
      const resetPasswordData = {
        token: resetToken,
        password: 'newpassword123',
      };

      return request(app.getHttpServer())
        .post('/reset-password')
        .send(resetPasswordData)
        .expect(201)
        .expect((response) => {
          expect(response.body.message).toBe('Senha redefinida com sucesso');
        });
    });

    it('deve retornar erro 400 para token ou senha inválidos', async () => {
      const invalidData = {
        token: '',
        password: 'short',
      };

      return request(app.getHttpServer())
        .post('/reset-password')
        .send(invalidData)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain('token should not be empty');
          expect(response.body.message).toContain(
            'password must be longer than or equal to 8 characters',
          );
        });
    });

    it('deve retornar erro 404 se o token for inválido', async () => {
      const invalidTokenData = {
        token: 'invalid-token',
        password: 'newpassword123',
      };

      return request(app.getHttpServer())
        .post('/reset-password')
        .send(invalidTokenData)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toBe('Token inválido ou expirado');
        });
    });
  });
});
