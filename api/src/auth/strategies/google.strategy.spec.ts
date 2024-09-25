import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GoogleStrategy } from './google.strategy';
import { RegisterProviderUseCase } from '../use-cases/register-provider.usecase';
import { IGoogleProfile } from '../interfaces/google-profile.interface';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;
  let registerProviderUseCase: RegisterProviderUseCase;

  beforeEach(() => {
    registerProviderUseCase = {
      execute: vi.fn(),
    } as any;

    strategy = new GoogleStrategy(registerProviderUseCase);
  });

  it('should validate and register a user', async () => {
    const profile: IGoogleProfile = {
      id: '123',
      emails: [{ value: 'test@example.com', verified: true }],
      displayName: 'Test User',
      name: { givenName: 'Test', familyName: 'User' },
      photos: [{ value: 'http://example.com/photo.jpg' }],
    };

    const done = vi.fn();
    await strategy.validate(
      'accessToken',
      'refreshToken',
      profile as any,
      done,
    );

    expect(registerProviderUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@example.com',
        username: 'test',
        name: 'Test User',
      }),
    );

    expect(done).toHaveBeenCalled();
  });
});
