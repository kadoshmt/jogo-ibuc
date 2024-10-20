import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@shared/database/prisma.service';
import { CreateUserInputDto } from '@src/users/dtos/create-user-input.dto';
import { UpdateUserInputDto } from '@src/users/dtos/update-user-input.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RegisterInputDto } from '@src/auth/dtos/register-input.dto';
import { LoggedUserOutputDto } from '@src/auth/dtos/logged-user-output.dto';
import { EmailService } from '@src/shared/email/email.service';
import { UserProfileOutputDto } from './dtos/user-profile-output.dto';
import { UserAdminOutputDto } from './dtos/users-admin-output.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: LoggedUserOutputDto;
  let accessToken: string;

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
      .compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  beforeEach(async () => {
    const registerData: RegisterInputDto = {
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin User',
      username: 'admin',
      genre: 'MASCULINO',
      newsletter: true,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerData)
      .expect(201);

    // Altera o usuário para Admin
    await prisma.users.update({
      where: { id: response.body.user.id },
      data: { role: 'ADMIN' },
    });

    const loginData = {
      email: registerData.email,
      password: registerData.password,
    };

    // Faz o login como usuário Admin
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginData)
      .expect(201);

    user = loginResponse.body.user;
    accessToken = loginResponse.body.accessToken;
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

  describe('POST /users', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      const userData: CreateUserInputDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        username: 'newuser',
        role: 'JOGADOR',
        genre: 'MASCULINO',
      };

      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(userData)
        .expect(201)
        .expect((response) => {
          expect(response.body.message).toBe('Usuário criado com sucesso');
          expect(response.body.user.email).toBe(userData.email);
        });
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const invalidUserData = {
        email: 'invalid-email',
        password: 'short',
        name: '',
        username: 'invalid username!',
        role: 'UNKNOWN',
        genre: 'INVALID_GENRE',
      };

      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidUserData)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain('email must be an email');
          expect(response.body.message).toContain(
            'password must be longer than or equal to 6 characters',
          );
          expect(response.body.message).toContain('name should not be empty');
          expect(response.body.message).toContain(
            'Username must contain only letters, numbers and underscores ("_")',
          );
          expect(response.body.message).toContain(
            'Role must be one of: ADMIN, COLABORADOR, JOGADOR, PROFESSOR',
          );
          expect(response.body.message).toContain(
            'Genre must be one of: MASCULINO, FEMININO',
          );
        });
    });
  });

  describe('PUT /users/:id', () => {
    // let createdUser: IUsers;

    // beforeEach(async () => {
    //   const registerData: RegisterInputDto = {
    //     email: 'updatableuser@example.com',
    //     password: 'password123',
    //     name: 'Updatable User',
    //     username: 'updatableuser',
    //     genre: 'MASCULINO',
    //   };

    //   await request(app.getHttpServer())
    //     .post('/auth/register')
    //     .send(registerData)
    //     .expect(201);
    // });

    it('deve atualizar o usuário com sucesso', async () => {
      const updateData: UpdateUserInputDto = {
        email: 'updateduser@example.com',
        name: 'Updated User',
        username: 'updateduser',
        role: 'PROFESSOR',
        genre: 'MASCULINO',
      };

      return request(app.getHttpServer())
        .put(`/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200)
        .expect((response) => {
          expect(response.body.message).toBe('Usuário atualizado com sucesso');
          expect(response.body.user.email).toBe(updateData.email);
          expect(response.body.user.name).toBe(updateData.name);
        });
    });

    it('deve retornar erro 400 para dados inválidos na atualização', async () => {
      const invalidUpdateData = {
        email: 'invalid-email',
        username: 'invalid username!',
        name: '',
        role: '',
        genre: '',
        phone: '9999',
      };

      return request(app.getHttpServer())
        .put(`/users/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidUpdateData)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain('email must be an email');
          expect(response.body.message).toContain(
            'Username must contain only letters, numbers and underscores ("_")',
          );
          expect(response.body.message).toContain('name should not be empty');
          expect(response.body.message).toContain(
            'Role must be one of: ADMIN, COLABORADOR, JOGADOR, PROFESSOR',
          );
          expect(response.body.message).toContain(
            'Genre must be one of: MASCULINO, FEMININO',
          );
          expect(response.body.message).toContain(
            'Phone number must be in one of the formats: (99) 9999-9999, (99) 99999-9999, +999 (99) 9999-9999, +999 (99) 99999-9999',
          );
        });
    });
  });

  describe('DELETE /users', () => {
    let userToDelete: LoggedUserOutputDto;

    beforeEach(async () => {
      const registerData: RegisterInputDto = {
        email: 'updatableuser@example.com',
        password: 'password123',
        name: 'Updatable User',
        username: 'updatableuser',
        genre: 'MASCULINO',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      userToDelete = response.body.user;
    });

    it('deve deletar o usuário com sucesso', async () => {
      return request(app.getHttpServer())
        .delete('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          userId: userToDelete.id,
          transferUserId: user.id,
        })
        .expect(204);
    });

    it('deve retornar erro 400 para ID inválido', async () => {
      return request(app.getHttpServer())
        .delete('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          userId: 'invalid-uuid',
          transferUserId: 'invalid-uuid',
        })
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain('userId must be a UUID');
        });
    });
  });

  describe('GET /users/:id', () => {
    let createdUser: LoggedUserOutputDto;

    beforeEach(async () => {
      const registerData: RegisterInputDto = {
        email: 'updatableuser@example.com',
        password: 'password123',
        name: 'Updatable User',
        username: 'updatableuser',
        genre: 'MASCULINO',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      createdUser = response.body.user;
    });

    it('deve encontrar o usuário por ID com sucesso', async () => {
      return request(app.getHttpServer())
        .get(`/users/${createdUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.email).toBe(createdUser.email);
        });
    });

    it('deve retornar erro 404 se o usuário não for encontrado', async () => {
      return request(app.getHttpServer())
        .get('/users/invalid-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect((response) => {
          expect(response.body.message).toBe('Not Found');
        });
    });
  });

  describe('GET /users', () => {
    beforeEach(async () => {
      const registerData: RegisterInputDto = {
        email: 'admin2@example.com',
        password: 'password123',
        name: 'Admin User 2',
        username: 'admin2',
        genre: 'MASCULINO',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      // Altera o usuário para Admin
      await prisma.users.update({
        where: { id: response.body.user.id },
        data: { role: 'ADMIN' },
      });
    });

    it('deve listar todos os usuários', async () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBeGreaterThan(1);
          response.body.forEach((user: UserProfileOutputDto) => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('role');
          });
        });
    });
  });

  describe('GET /users/admin', () => {
    beforeEach(async () => {
      const registerData: RegisterInputDto = {
        email: 'usertest@example.com',
        password: 'password123',
        name: 'User Test',
        username: 'usertest',
        genre: 'MASCULINO',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);
    });
    it('deve listar todos os administradores', async () => {
      return request(app.getHttpServer())
        .get('/users/admin')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBe(1);
          response.body.forEach((adminUser: UserAdminOutputDto) => {
            expect(adminUser).toHaveProperty('id');
            expect(adminUser).toHaveProperty('name');
          });
        });
    });
  });

  describe('GET /users/paginated', () => {
    beforeEach(async () => {
      const registerData: RegisterInputDto = {
        email: 'usertest@example.com',
        password: 'password123',
        name: 'User Test',
        username: 'usertest',
        genre: 'MASCULINO',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);
    });
    it('deve listar os usuários com paginação padrão', async () => {
      return request(app.getHttpServer())
        .get('/users/paginated')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('data');
          expect(response.body).toHaveProperty('meta');
          expect(response.body.data).toBeInstanceOf(Array);
          expect(response.body.data.length).toBeGreaterThan(0);
          expect(response.body.meta).toHaveProperty('total');
          expect(response.body.meta).toHaveProperty('currentPage');
          expect(response.body.meta).toHaveProperty('perPage');
          expect(response.body.meta).toHaveProperty('lastPage');
        });
    });

    it('deve listar os usuários com paginação personalizada (perPage=1, page=2)', async () => {
      return request(app.getHttpServer())
        .get('/users/paginated?perPage=1&page=2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('data');
          expect(response.body).toHaveProperty('meta');
          expect(response.body.data).toBeInstanceOf(Array);
          expect(response.body.data.length).toBe(1); // Deve retornar 1 usuários por página
          expect(response.body.meta.currentPage).toBe(2);
          expect(response.body.meta.perPage).toBe(1);
        });
    });

    it('deve listar os usuários com paginação e filtros personalizados (perPage=1, page=1, email=usertest@example.com)', async () => {
      return request(app.getHttpServer())
        .get('/users/paginated?perPage=1&page=1&email=usertest@example.com')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('data');
          expect(response.body).toHaveProperty('meta');
          expect(response.body.data).toBeInstanceOf(Array);
          expect(response.body.data.length).toBe(1); // Deve retornar 1 usuários por página
          expect(response.body.meta.currentPage).toBe(1);
          expect(response.body.meta.perPage).toBe(1);
        });
    });
  });
});
