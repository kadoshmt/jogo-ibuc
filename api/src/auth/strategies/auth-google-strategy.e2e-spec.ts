/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import request from 'supertest';
import { AppModule } from '@src/app.module';
import { GoogleStrategy } from '@src/auth/strategies/google.strategy';
import * as uuid from 'uuid';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from '@src/shared/database/prisma.service';
import { EmailService } from '@src/shared/email/email.service';
import { GoogleAuthService } from '@src/shared/google-auth/google-auth.service';
import { skipLast } from 'rxjs';

class MockGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = {
      id: 'mock-user-id',
      email: 'testuser@example.com',
      name: 'Test User',
    };

    done(null, user);
  }
}

describe('AuthController (e2e) - Google Authentication', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cacheManager: CacheStore;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GoogleStrategy)
      .useClass(MockGoogleStrategy)
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
    cacheManager = moduleRef.get(CACHE_MANAGER);

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

  it('should redirect to Google OAuth', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/google')
      .expect(302);

    expect(response.headers.location).toBeDefined();
  });

  it.skip('should handle Google OAuth callback and redirect with code', async () => {
    const mockUuid = 'mock-uuid';
    vi.spyOn(uuid, 'v4').mockReturnValue(mockUuid);

    const cacheSetSpy = vi
      .spyOn(cacheManager, 'set')
      .mockImplementation(() => undefined);

    const response = await request(app.getHttpServer())
      .get('/auth/google/redirect')
      .query({ code: 'mock-code' }) // Simulate the code parameter
      .expect(302);

    expect(response.headers.location).toContain(
      `http://localhost:3000/auth/callback/${mockUuid}`,
    );

    expect(cacheSetSpy).toHaveBeenCalledWith(mockUuid, expect.any(Object), {
      ttl: 60 * 2,
    });
  });

  it('should exchange code for authentication data', async () => {
    const mockUuid = 'mock-uuid';
    const mockData = {
      accessToken: 'mock-access-token',
      user: {
        email: 'testuser@example.com',
      },
    };

    vi.spyOn(cacheManager, 'get').mockResolvedValue(mockData);

    const response = await request(app.getHttpServer())
      .get(`/auth/exchange-code/${mockUuid}`)
      .expect(200);

    expect(response.body).toEqual(mockData);
  });

  it('should return 404 if code is not found', async () => {
    const mockUuid = 'invalid-uuid';

    vi.spyOn(cacheManager, 'get').mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .get(`/auth/exchange-code/${mockUuid}`)
      .expect(404);

    expect(response.body.message).toBe('Code not found');
  });
});
