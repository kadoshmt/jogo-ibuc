import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterUseCase } from './register.usecase';
import { InMemoryUserRepository } from 'src/users/repositories/in-memory-user.repository';
import { InMemoryProfileRepository } from 'src/profile/repositories/in-memory-profile.repository';
import { RegisterInputDto } from '../dtos/register-input.dto';
import { EmailConflictException } from 'src/common/exceptions/email-conflict.exception';
import { PrismaService } from 'src/shared/database/prisma.service';
import { IRole } from 'src/users/interfaces/users.interface';
import { IGenre } from 'src/profile/interfaces/profile.interface';

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;
  let userRepository: InMemoryUserRepository;
  let profileRepository: InMemoryProfileRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    profileRepository = new InMemoryProfileRepository();
    registerUseCase = new RegisterUseCase(
      profileRepository,
      userRepository,
      new PrismaService(),
    );
  });

  it('should register a new user successfully', async () => {
    const userInput: RegisterInputDto = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      username: 'newuser',
      genre: IGenre.MASCULINO,
    };

    const result = await registerUseCase.execute(userInput);

    expect(result).toBeDefined();
    expect(result.email).toBe(userInput.email);
    expect(result.name).toBe(userInput.name);
    expect(result.username).toBe(userInput.username);
  });

  it('should throw EmailConflictException if email already exists', async () => {
    const userInput: RegisterInputDto = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'Existing User',
      username: 'existinguser',
      genre: IGenre.MASCULINO,
    };

    // Simula um usuário existente
    await userRepository.create({
      email: userInput.email,
      password: 'password',
      name: 'Inexisting User',
      genre: IGenre.MASCULINO,
      role: IRole.JOGADOR,
      username: 'inexistinguser',
    });

    await expect(registerUseCase.execute(userInput)).rejects.toThrow(
      EmailConflictException,
    );
  });

  it('should generate a new username if the provided username already exists', async () => {
    const userInput: RegisterInputDto = {
      email: 'uniqueuser@example.com',
      password: 'password123',
      name: 'Unique User',
      username: 'existinguser',
      genre: IGenre.FEMININO,
    };

    // Simula um nome de usuário existente
    await profileRepository.create({
      userId: 'existingUserId',
      username: 'existinguser',
      name: 'Existing User',
      genre: IGenre.FEMININO,
    });

    const result = await registerUseCase.execute(userInput);

    expect(result).toBeDefined();
    expect(result.username).not.toBe(userInput.username); // Verifica que o nome de usuário foi alterado
    expect(result.username).toMatch(/^existinguser_\d{1,4}$/); // Verifica que o novo nome de usuário segue o padrão "existinguser_xxxx"
  });
});
