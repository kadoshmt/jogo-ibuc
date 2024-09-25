import { describe, it, expect, beforeEach } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository';
import { FindAllUsersUserCase } from './find-all-users.usecase';
import { IRole, IUsers } from '../interfaces/users.interface';
import { UsersFilterInputDto } from '../dtos/users-filter-input.dto';
import { IGenre } from 'src/profile/interfaces/profile.interface';

describe('FindAllUsersUserCase', () => {
  let findAllUsersUserCase: FindAllUsersUserCase;
  let userRepository: InMemoryUserRepository;
  let adminUser: IUsers;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    findAllUsersUserCase = new FindAllUsersUserCase(userRepository);

    adminUser = {
      id: 'admin-1',
      email: 'admin@example.com',
      password: 'hashedpassword',
      role: IRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should return all users for an admin user', async () => {
    const filterDto: UsersFilterInputDto = {};
    await userRepository.create({
      email: 'user1@example.com',
      name: 'New User 1',
      username: 'newuser1',
      password: 'hashedpassword',
      role: IRole.JOGADOR,
      genre: IGenre.NAO_INFORMADO,
    });

    await userRepository.create({
      email: 'user2@example.com',
      name: 'New User 2',
      username: 'newuser2',
      password: 'hashedpassword',
      role: IRole.COLABORADOR,
      genre: IGenre.MASCULINO,
    });

    const result = await findAllUsersUserCase.execute(filterDto, adminUser);

    expect(result).toHaveLength(2);
    expect(result[0].email).toBe('user1@example.com');
    expect(result[1].email).toBe('user2@example.com');
    expect(result[1].role).toBe(IRole.COLABORADOR);
  });

  it('should return filtered users based on role', async () => {
    const filterDto: UsersFilterInputDto = {
      role: IRole.COLABORADOR,
    };

    await userRepository.create({
      email: 'user1@example.com',
      name: 'New User 1',
      username: 'newuser1',
      password: 'hashedpassword',
      role: IRole.JOGADOR,
      genre: IGenre.NAO_INFORMADO,
    });

    await userRepository.create({
      email: 'user2@example.com',
      name: 'New User 2',
      username: 'newuser2',
      password: 'hashedpassword',
      role: IRole.COLABORADOR,
      genre: IGenre.MASCULINO,
    });

    const result = await findAllUsersUserCase.execute(filterDto, adminUser);

    expect(result).toHaveLength(1);
    expect(result[0].role).toBe(IRole.COLABORADOR);
    expect(result[0].email).toBe('user2@example.com');
  });

  it('should throw UnauthorizedException if logged user is not admin or colaborador', async () => {
    const nonAdminUser: IUsers = {
      ...adminUser,
      role: IRole.JOGADOR,
    };
    const filterDto: UsersFilterInputDto = {};

    await expect(
      findAllUsersUserCase.execute(filterDto, nonAdminUser),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return empty list if no users match the filter', async () => {
    const filterDto: UsersFilterInputDto = {
      role: IRole.PROFESSOR,
    };

    await userRepository.create({
      email: 'user1@example.com',
      name: 'New User 1',
      username: 'newuser1',
      password: 'hashedpassword',
      role: IRole.JOGADOR,
      genre: IGenre.NAO_INFORMADO,
    });

    const result = await findAllUsersUserCase.execute(filterDto, adminUser);

    expect(result).toHaveLength(0);
  });
});
