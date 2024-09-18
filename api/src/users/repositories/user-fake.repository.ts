// src/users/repositories/user-fake.repository.ts

import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { PaginationFilter } from 'src/common/dtos/pagination-filter.dto';

@Injectable()
export class UserFakeRepository implements IUserRepository {
  findAll(condition: PaginationFilter): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  private users: User[] = [];

  async findOneById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.users.find((user) => user.username === username) || null;
  }

  async findOne(condition: Partial<User>): Promise<User | null> {
    return (
      this.users.find((user) =>
        Object.entries(condition).every(
          ([key, value]) => (user as any)[key] === value,
        ),
      ) || null
    );
  }

  async create(data: CreateUserDto): Promise<User> {
    const newUser: User = {
      id: 'fake-id-' + Math.random().toString(36).substr(2, 9),
      email: data.email,
      username: data.username,
      password: data.password ?? null, // Converte undefined para null automaticamente
      name: data.name,
      googleId: data.googleId ?? null,
      microsoftId: data.microsoftId ?? null,
      facebookId: data.facebookId ?? null,
      avatar: data.avatar ?? null,
      role: data.role ?? 'PLAYER', // Ou define o valor padrão diretamente
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) throw new Error('User not found');
    Object.assign(user, data);
    user.updatedAt = new Date();
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
