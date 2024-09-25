import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MicrosoftStrategy } from './microsoft.strategy';
import { RegisterProviderUseCase } from '../use-cases/register-provider.usecase';

describe('MicrosoftStrategy', () => {
  let strategy: MicrosoftStrategy;
  let registerProviderUseCase: RegisterProviderUseCase;

  beforeEach(() => {
    registerProviderUseCase = {
      execute: vi.fn(),
    } as any;

    strategy = new MicrosoftStrategy(registerProviderUseCase);
  });

  it('should validate and register a user', async () => {
    const profile = {
      id: '123',
      emails: [{ value: 'test@microsoft.com', verified: true }],
      displayName: 'Microsoft User',
      name: { givenName: 'Microsoft', familyName: 'User' },
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
        email: 'test@microsoft.com',
        username: 'test',
        name: 'Microsoft User',
      }),
    );

    expect(done).toHaveBeenCalled();
  });
});
