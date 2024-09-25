import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FacebookStrategy } from './facebook.strategy';
import { RegisterProviderUseCase } from '../use-cases/register-provider.usecase';
import { BadRequestException } from '@nestjs/common';

describe('FacebookStrategy', () => {
  let strategy: FacebookStrategy;
  let registerProviderUseCase: RegisterProviderUseCase;

  beforeEach(() => {
    registerProviderUseCase = {
      execute: vi.fn(),
    } as any;

    strategy = new FacebookStrategy(registerProviderUseCase);
  });

  it('should validate and register a user', async () => {
    const profile = {
      id: '123',
      emails: [{ value: 'test@facebook.com', verified: true }],
      displayName: 'Facebook User',
      name: { givenName: 'Facebook', familyName: 'User' },
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
        email: 'test@facebook.com',
        username: 'test',
        name: 'Facebook User',
      }),
    );

    expect(done).toHaveBeenCalled();
  });

  it('should throw BadRequestException if no valid email is returned', async () => {
    const profile = {
      id: '123',
      emails: [], // Sem email válido
      name: { givenName: 'Test', familyName: 'User' },
      photos: [{ value: 'http://example.com/photo.jpg' }],
    };

    const done = vi.fn();

    await expect(
      strategy.validate('accessToken', 'refreshToken', profile as any, done),
    ).rejects.toThrow(
      new BadRequestException('O Facebook não retornou nenhum e-mail válido.'),
    );
  });

  it('should throw BadRequestException if no valid givenName or familyName is returned', async () => {
    const profile = {
      id: '123',
      emails: [{ value: 'test@facebook.com' }],
      name: { givenName: null, familyName: null }, // Missing name fields
      photos: [{ value: 'http://example.com/photo.jpg' }],
    };

    const done = vi.fn();

    await expect(
      strategy.validate('accessToken', 'refreshToken', profile as any, done),
    ).rejects.toThrow(BadRequestException);

    expect(registerProviderUseCase.execute).not.toHaveBeenCalled();
  });

  it('should build the full name from givenName, middleName, and familyName if displayName is not present', async () => {
    const profile = {
      id: '123',
      emails: [{ value: 'test@example.com', verified: true }],
      displayName: undefined, // displayName ausente
      name: {
        givenName: 'John',
        middleName: 'Doe',
        familyName: 'Smith',
      },
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
        name: 'John Doe Smith', // Verifica se o nome completo foi construído corretamente
      }),
    );

    expect(done).toHaveBeenCalled();
  });
});
