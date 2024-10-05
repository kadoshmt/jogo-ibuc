import { describe, it, expect, beforeEach } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository';
import { IRole, IUsers } from '../interfaces/users.interface';
import { IGenre } from 'src/profile/interfaces/profile.interface';
import { FindAllAdminUsersUserCase } from './find-all-admin-users.usecase';

describe('FindAllAdminUsersUserCase', () => {
  let findAllAdminUsersUserCase: FindAllAdminUsersUserCase;
  let userRepository: InMemoryUserRepository;
  let adminUser: IUsers;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    findAllAdminUsersUserCase = new FindAllAdminUsersUserCase(userRepository);

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
    const userAdmin = await userRepository.create({
      email: 'user1@example.com',
      name: 'New User 1',
      username: 'newuser1',
      password: 'hashedpassword',
      role: IRole.ADMIN,
      genre: IGenre.NAO_INFORMADO,
    });

    const userAdmin2 = await userRepository.create({
      email: 'user2@example.com',
      name: 'New User 2',
      username: 'newuser2',
      password: 'hashedpassword',
      role: IRole.ADMIN,
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

    const result = await findAllAdminUsersUserCase.execute(adminUser);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(userAdmin.id);
    // expect(result[0].name).toBe('New User 1');
    expect(result[1].id).toBe(userAdmin2.id);
    // expect(result[1].name).toBe('New User 2');
  });

  it('should throw UnauthorizedException if logged user is not admin', async () => {
    const nonAdminUser: IUsers = {
      ...adminUser,
      role: IRole.COLABORADOR,
    };

    await expect(
      findAllAdminUsersUserCase.execute(nonAdminUser),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return empty list if no users match the filter', async () => {
    await userRepository.create({
      email: 'user1@example.com',
      name: 'New User 1',
      username: 'newuser1',
      password: 'hashedpassword',
      role: IRole.JOGADOR,
      genre: IGenre.NAO_INFORMADO,
    });

    const result = await findAllAdminUsersUserCase.execute(adminUser);

    expect(result).toHaveLength(0);
  });
});
