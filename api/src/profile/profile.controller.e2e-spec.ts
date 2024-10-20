import { INestApplication, ValidationPipe } from '@nestjs/common';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@shared/database/prisma.service';
// import { JwtService } from '@nestjs/jwt';
import { RegisterInputDto } from '@src/auth/dtos/register-input.dto';
import { EmailService } from '@src/shared/email/email.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoggedUserOutputDto } from '@src/auth/dtos/logged-user-output.dto';
import { FakeUploaderService } from '@src/shared/storage/fake-uploader.service';
import { Uploader } from '@src/shared/storage/interfaces/uploader.interface';

describe('ProfileController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  // let jwtService: JwtService;
  let accessToken: string;
  let user: LoggedUserOutputDto;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue({
        sendMail: vi.fn().mockResolvedValue(null), // Mock do método sendMail
      })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true }) // Desativa o throttling durante os testes
      // .overrideProvider(CACHE_MANAGER)
      // .useValue({
      //   get: vi.fn(),
      //   set: vi.fn(),
      // })
      .overrideProvider(Uploader) // Sobrescreve o Uploader para usar o FakeUploaderService
      .useClass(FakeUploaderService)
      .compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    // jwtService = moduleRef.get(JwtService);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    // Cria um usuário de teste e gera o token JWT
    // const user = await prisma.users.create({
    //   data: {
    //     email: 'testuser@example.com',
    //     password: 'password123',
    //     name: 'Test User',
    //     username: 'testuser',
    //     genre: 'MASCULINO',
    //   },
    // });

    // accessToken = jwtService.sign({ id: user.id });
  });

  beforeEach(async () => {
    const registerData: RegisterInputDto = {
      email: 'testuser@example.com',
      password: 'password123',
      name: 'Test User',
      username: 'testuser',
      genre: 'MASCULINO',
      newsletter: true,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerData)
      .expect(201);

    accessToken = response.body.accessToken;
    user = response.body.user;
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

  // Teste para o GET /profile
  describe('GET /profile', () => {
    it('deve retornar o perfil do usuário autenticado', async () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('userId');
          expect(response.body).toHaveProperty('name', 'Test User');
          expect(response.body).toHaveProperty('username', 'testuser');
        });
    });

    it('deve retornar 401 se o token JWT não for fornecido', async () => {
      return request(app.getHttpServer()).get('/profile').expect(401);
    });
  });

  // Teste para o PUT /profile
  describe('PUT /profile', () => {
    it('deve atualizar o perfil do usuário autenticado', async () => {
      const updateData = {
        ...user,
        name: 'Updated User',
        username: 'updateduser',
      };

      return request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200)
        .expect((response) => {
          expect(response.body.name).toBe(updateData.name);
          expect(response.body.username).toBe(updateData.username);
        });
    });

    it('deve retornar erro 400 se os dados forem inválidos', async () => {
      const invalidData = {
        username: 'invalid username!', // Não segue o regex esperado
      };

      return request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidData)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain(
            'Username must contain only letters, numbers and underscores ("_")',
          );
        });
    });
  });

  // Teste para o PATCH /profile/check-username/:username
  describe('GET /profile/check-username/:username', () => {
    it('deve retornar que o username está disponível', async () => {
      return request(app.getHttpServer())
        .get('/profile/check-username/newuser')
        .expect(200)
        .expect((response) => {
          expect(response.body.isAvaliable).toBe(true);
          expect(response.body.message).toBe('Username está disponível');
        });
    });

    it('deve retornar que o username não está disponível', async () => {
      return request(app.getHttpServer())
        .get('/profile/check-username/testuser')
        .expect(200)
        .expect((response) => {
          expect(response.body.isAvaliable).toBe(false);
          expect(response.body.message).toBe('Username não está disponível');
        });
    });
  });

  // Teste para o GET /profile/check-password
  describe('GET /profile/check-password', () => {
    it('deve retornar que o usuário possui password', async () => {
      return request(app.getHttpServer())
        .get('/profile/check-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.wasProvided).toBe(true);
          expect(response.body.message).toBe('Usuário possui password');
        });
    });

    it('deve retornar que o usuário ainda não possui password', async () => {
      await prisma.users.update({
        where: { id: user.id },
        data: { password: null },
      });
      return request(app.getHttpServer())
        .get('/profile/check-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.wasProvided).toBe(false);
          expect(response.body.message).toBe(
            'Usuário ainda não possui password',
          );
        });
    });
  });

  // Teste para o PATCH /profile/create-password
  describe('PATCH /profile/create-password', () => {
    beforeEach(async () => {
      await prisma.users.update({
        where: { id: user.id },
        data: { password: null },
      });
    });
    it('deve retornar que a senha foi criada com sucesso', async () => {
      const createPasswordData = {
        password: 'newpassword456',
      };

      return request(app.getHttpServer())
        .patch('/profile/create-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPasswordData)
        .expect(200)
        .expect((response) => {
          expect(response.body.message).toBe('Senha criada com sucesso');
        });
    });

    it('deve retornar erro 400 quando o usuário já possuir uma senha', async () => {
      const createPasswordData = {
        password: 'newpassword456',
      };

      // Primeiro cria a senha
      await request(app.getHttpServer())
        .patch('/profile/create-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPasswordData)
        .expect(200);

      return request(app.getHttpServer())
        .patch('/profile/create-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPasswordData)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toBe('Usuário com senha já definida');
        });
    });
  });

  // Teste para o PATCH /profile/change-password
  describe('PATCH /profile/change-password', () => {
    it('deve alterar a senha com sucesso', async () => {
      const changePasswordData = {
        currentPassword: 'password123',
        newPassword: 'newpassword456',
      };

      return request(app.getHttpServer())
        .put('/profile/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changePasswordData)
        .expect(204);
    });

    it('deve retornar erro 400 se a nova senha for inválida', async () => {
      const invalidPasswordData = {
        currentPassword: 'password123',
        newPassword: 'short',
      };

      return request(app.getHttpServer())
        .put('/profile/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidPasswordData)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain(
            'newPassword must be longer than or equal to 8 characters',
          );
        });
    });

    it('deve retornar erro 400 se a senha atual for inválida', async () => {
      const invalidPasswordData = {
        currentPassword: 'password1234',
        newPassword: 'newpassword456',
      };

      return request(app.getHttpServer())
        .put('/profile/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidPasswordData)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain(
            'A senha atual fornecida está incorreta.',
          );
        });
    });

    it('deve retornar erro 400 se o usuário não tiver uma senha definida', async () => {
      const invalidPasswordData = {
        currentPassword: 'password1234',
        newPassword: 'newpassword456',
      };

      // Altera a senha do usuário para null
      await prisma.users.update({
        where: { id: user.id },
        data: { password: null },
      });

      return request(app.getHttpServer())
        .put('/profile/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidPasswordData)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain(
            'Usuário sem senha definida.',
          );
        });
    });

    it.skip('deve retornar erro 400 se o usuário não for encontrado', async () => {
      const invalidPasswordData = {
        currentPassword: 'password123',
        newPassword: 'newpassword456',
      };

      // deleta o usuário
      await prisma.$transaction([
        prisma.profile.deleteMany(),
        prisma.users.deleteMany(),
      ]);

      return request(app.getHttpServer())
        .put('/profile/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidPasswordData)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain('Usuário não encontrado.');
        });
    });
  });

  // Teste para o DELETE /profile
  describe('DELETE /profile', () => {
    it('deve deletar a conta do usuário autenticado', async () => {
      return request(app.getHttpServer())
        .delete('/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('deve retornar 401 se o token JWT não for fornecido ao deletar a conta', async () => {
      return request(app.getHttpServer()).delete('/profile').expect(401);
    });
  });

  // Teste para o upload de avatar
  describe('PATCH /profile/upload-avatar', () => {
    it('deve fazer upload do avatar com sucesso', async () => {
      return request(app.getHttpServer())
        .patch('/profile/upload-avatar')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('profileAvatar', 'test/avatar.png')
        .expect(200)
        .expect((response) => {
          expect(response.body.avatarUrl).toBeDefined();
        });
    });

    it('deve retornar erro 400 se o arquivo for muito grande', async () => {
      return request(app.getHttpServer())
        .patch('/profile/upload-avatar')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('profileAvatar', 'test/large-file.png')
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain(
            'Validation failed (expected size is less than 5242880)',
          );
        });
    });

    it('deve retornar erro 400 quando o arquivo enviado for inválido ', async () => {
      return request(app.getHttpServer())
        .patch('/profile/upload-avatar')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('profileAvatar', 'test/invalid-file.svg')
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain(
            'Validation failed (expected type is .(png|jpg|jpeg|webp))',
          );
        });
    });
  });

  // Teste para o DELETE /profile/delete-avatar
  describe('DELETE /profile/delete-avatar', () => {
    it('deve deletar o avatar com sucesso', async () => {
      return request(app.getHttpServer())
        .delete('/profile/delete-avatar')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('deve retornar erro 401 se o token JWT não for fornecido', async () => {
      return request(app.getHttpServer())
        .delete('/profile/delete-avatar')
        .expect(401);
    });
  });
});
