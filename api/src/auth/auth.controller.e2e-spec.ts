import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@shared/database/prisma.service';
import request from 'supertest';
import { RegisterInputDto } from '@src/auth/dtos/register-input.dto';
import { LoginInputDto } from '@src/auth/dtos/login-input.dto';
import { AppModule } from '@src/app.module';
import { EmailService } from '@shared/email/email.service';
import { GoogleAuthService } from '@shared/google-auth/google-auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue({
        sendMail: vi.fn().mockResolvedValue(null), // Mock do método sendMail
      })
      .overrideProvider(GoogleAuthService)
      .useValue({
        getCredentials: vi.fn().mockResolvedValue({
          access_token: 'mock_access_token',
        }),
      })
      .overrideProvider(CACHE_MANAGER)
      .useValue({
        get: vi.fn(),
        set: vi.fn(),
      })
      .compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  afterEach(async () => {
    await prisma.$transaction([
      prisma.profile.deleteMany(),
      prisma.users.deleteMany(),
    ]);
  });

  describe('/auth/register (POST)', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const registerData: RegisterInputDto = {
        email: 'testuser@example.com',
        password: 'password123',
        name: 'Test User',
        username: 'testuser',
        genre: 'MASCULINO',
        newsletter: true,
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('accessToken');
          expect(response.body.user).toHaveProperty('id');
          expect(response.body.user.email).toBe(registerData.email);
        });
    });

    it('deve retornar erro 400 se os dados forem inválidos', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'short',
        name: '',
        username: 'invalid username!',
        genre: 'UNKNOWN',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidData)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain('email must be an email');
          expect(response.body.message).toContain(
            'password must be longer than or equal to 8 characters',
          );
          expect(response.body.message).toContain('name should not be empty');
          expect(response.body.message).toContain(
            'Username must contain only letters, numbers and underscores ("_")',
          );
          expect(response.body.message).toContain(
            'Genre must be one of: MASCULINO, FEMININO',
          );
        });
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      const registerData: RegisterInputDto = {
        email: 'loginuser@example.com',
        password: 'password123',
        name: 'Login User',
        username: 'loginuser',
        genre: 'MASCULINO',
        newsletter: true,
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);
    });

    afterEach(async () => {
      await prisma.$transaction([
        prisma.profile.deleteMany(),
        prisma.users.deleteMany(),
      ]);
    });

    it('deve fazer login com sucesso', async () => {
      const loginData: LoginInputDto = {
        email: 'loginuser@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('accessToken');
          expect(response.body.user.email).toBe(loginData.email);
        });
    });

    it('deve retornar erro 401 para credenciais inválidas', async () => {
      const invalidLoginData: LoginInputDto = {
        email: 'wronguser@example.com',
        password: 'wrongpassword',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginData)
        .expect(401)
        .expect((response) => {
          expect(response.body.message).toBe('E-mail ou senha incorretos');
        });
    });
  });
});
