import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterProviderUseCase } from './register-provider.usecase';
import { InMemoryUserRepository } from 'src/users/repositories/in-memory-user.repository';
import { InMemoryProfileRepository } from 'src/profile/repositories/in-memory-profile.repository';
import { RegisterProviderDto } from '../dtos/register-provider-input.dto';
import { ProviderConflictException } from 'src/common/exceptions/provider-conflict.exception';
import { PrismaService } from 'src/shared/database/prisma.service';

describe('RegisterProviderUseCase', () => {
  let registerProviderUseCase: RegisterProviderUseCase;
  let userRepository: InMemoryUserRepository;
  let profileRepository: InMemoryProfileRepository;
  let prisma: PrismaService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    profileRepository = new InMemoryProfileRepository();
    prisma = new PrismaService();
    registerProviderUseCase = new RegisterProviderUseCase(
      profileRepository,
      userRepository,
      prisma,
    );
  });

  it('should register a new user and profile successfully', async () => {
    const registerInput: RegisterProviderDto = {
      email: 'newuser@example.com',
      name: 'New User',
      username: 'newuser',
      provider: 'google',
      providerId: 'google-id-1',
      avatarUrl: 'https://example.com/avatar.png',
      newsletter: true,
    };

    const result = await registerProviderUseCase.execute(registerInput);

    expect(result).toBeDefined();
    expect(result.email).toBe(registerInput.email);
    expect(result.name).toBe(registerInput.name);
    expect(result.username).toBe(registerInput.username);
  });

  it('should return existing user profile if user already registered with the same provider', async () => {
    const registerInput: RegisterProviderDto = {
      email: 'existing@example.com',
      name: 'Existing User',
      username: 'existinguser',
      provider: 'google',
      providerId: 'google-id-1',
      avatarUrl: 'https://example.com/avatar.png',
      newsletter: true,
    };

    // Simula um usuário existente com o mesmo provedor
    const existingUser = await userRepository.createProvider({
      email: registerInput.email,
      provider: 'google',
      providerId: 'google-id-1',
      name: registerInput.name,
      username: registerInput.username,
    });

    await profileRepository.create({
      userId: existingUser.id,
      username: registerInput.username,
      name: registerInput.name,
    });

    const result = await registerProviderUseCase.execute(registerInput);

    expect(result).toBeDefined();
    expect(result.email).toBe(registerInput.email);
    expect(result.name).toBe(registerInput.name);
    expect(result.username).toBe(registerInput.username);
  });

  it('should throw ProviderConflictException if email is already registered with another provider', async () => {
    const registerInput: RegisterProviderDto = {
      email: 'existing@example.com',
      name: 'Existing User',
      username: 'existinguser',
      provider: 'microsoft',
      providerId: 'microsoft-id-1',
      avatarUrl: 'https://example.com/avatar.png',
      newsletter: true,
    };

    // Simula um usuário existente com outro provedor
    await userRepository.create({
      email: registerInput.email,
      googleId: 'google-id-1', // Email registrado com outro provedor
      name: registerInput.name,
      username: registerInput.username,
      password: '123456',
      role: 'JOGADOR',
      genre: 'NAO_INFORMADO',
    });

    await expect(
      registerProviderUseCase.execute(registerInput),
    ).rejects.toThrow(ProviderConflictException);
  });

  it('should generate a new username if the provided username is already taken', async () => {
    const registerInput: RegisterProviderDto = {
      email: 'newuser2@example.com',
      name: 'New User 2',
      username: 'existinguser',
      provider: 'google',
      providerId: 'google-id-2',
      avatarUrl: 'https://example.com/avatar.png',
      newsletter: true,
    };

    // Simula um username já existente
    await profileRepository.create({
      userId: 'existing-id',
      username: 'existinguser',
      name: 'Existing User',
    });

    const result = await registerProviderUseCase.execute(registerInput);

    expect(result).toBeDefined();
    expect(result.username).not.toBe(registerInput.username); // Deve ser um username gerado novo
    expect(result.username.startsWith('existinguser_')).toBe(true); // Verifica se o novo username começa com o username original
  });
});
