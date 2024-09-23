import { describe, it, expect, beforeEach } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository';
import { FindAllUsersPaginatedUserCase } from './find-all-users-paginated.usecase';

import { IUsers } from '../interfaces/users.interface';
import { ListUsersInputDto } from '../dto/list-users-input.dto';

describe('FindAllUsersPaginatedUserCase', () => {
  let findAllUsersPaginatedUserCase: FindAllUsersPaginatedUserCase;
  let userRepository: InMemoryUserRepository;
  let adminUser: IUsers;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    findAllUsersPaginatedUserCase = new FindAllUsersPaginatedUserCase(
      userRepository,
    );

    adminUser = {
      id: 'admin-1',
      email: 'admin@example.com',
      password: 'hashedpassword',
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should return paginated users when called by an admin user', async () => {
    // Arrange
    // Add some users to the in-memory repository
    await userRepository.create({
      email: 'user1@example.com',
      password: 'password123',
      role: Role.JOGADOR,
      name: 'User One',
      username: 'userone',
      genre: 'MASCULINO',
    });

    await userRepository.create({
      email: 'user2@example.com',
      password: 'password123',
      role: Role.JOGADOR,
      name: 'User Two',
      username: 'usertwo',
      genre: 'FEMININO',
    });

    await userRepository.create({
      email: 'user3@example.com',
      password: 'password123',
      role: Role.JOGADOR,
      name: 'User Tree',
      username: 'usertree',
      genre: 'MASCULINO',
    });

    const listUsersInputDto: ListUsersInputDto = {
      page: 2,
      perPage: 1,
    };

    // Act
    const result = await findAllUsersPaginatedUserCase.execute(
      listUsersInputDto,
      adminUser,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.data.length).toBe(1); // should return one user based on pagination
    expect(result.meta.total).toBe(3); // total users should be 2
    expect(result.meta.currentPage).toBe(2);
    expect(result.meta.perPage).toBe(1);
    expect(result.meta.lastPage).toBe(3);
    expect(result.meta.prev).toBe(1);
    expect(result.meta.next).toBe(3);
  });

  it('should throw UnauthorizedException if logged user is not admin or collaborator', async () => {
    // Arrange
    const nonAdminUser = {
      ...adminUser,
      role: Role.JOGADOR,
    };

    const listUsersInputDto: ListUsersInputDto = {
      page: 1,
      perPage: 10,
    };

    // Act & Assert
    await expect(
      findAllUsersPaginatedUserCase.execute(listUsersInputDto, nonAdminUser),
    ).rejects.toThrow(UnauthorizedException);
  });

  // it('should return empty result when no users match the filter', async () => {
  //   // Arrange
  //   const listUsersInputDto: ListUsersInputDto = {
  //     page: 1,
  //     perPage: 10,
  //     query: 'nonexistentuser',
  //   };

  //   // Act
  //   const result = await findAllUsersPaginatedUserCase.execute(
  //     listUsersInputDto,
  //     adminUser,
  //   );

  //   // Assert
  //   expect(result).toBeDefined();
  //   expect(result.data.length).toBe(0); // no users should match the query
  //   expect(result.meta.total).toBe(0);
  // });

  it('should return paginated users when filtered by role', async () => {
    // Arrange
    // Add some users to the in-memory repository
    await userRepository.create({
      email: 'user1@example.com',
      password: 'password123',
      role: Role.JOGADOR,
      name: 'User One',
      username: 'userone',
      country: 'Country 1',
      region: 'Region 1',
      city: 'City 1',
      genre: 'MASCULINO',
    });

    await userRepository.create({
      email: 'user2@example.com',
      password: 'password123',
      role: Role.ADMIN,
      name: 'User Two',
      username: 'usertwo',
      country: 'Country 2',
      region: 'Region 2',
      city: 'City 2',
      genre: 'FEMININO',
    });

    const listUsersInputDto: ListUsersInputDto = {
      page: 1,
      perPage: 10,
      role: Role.ADMIN,
    };

    // Act
    const result = await findAllUsersPaginatedUserCase.execute(
      listUsersInputDto,
      adminUser,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.data.length).toBe(1); // should return only one user with role ADMIN
    expect(result.data[0].role).toBe(Role.ADMIN);
    expect(result.meta.total).toBe(1); // total users with role ADMIN should be 1
  });
});
