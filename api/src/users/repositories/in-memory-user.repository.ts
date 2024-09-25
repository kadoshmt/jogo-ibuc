import { Users } from '@prisma/client'; // Usando o tipo do Prisma para consistência nos testes
import { IUserRepository } from '../interfaces/user-repository.interface';
import { PaginatedOutputDto } from 'src/common/dtos/paginated-output.dto';
import { UserProfileOutputDto } from '../dtos/user-profile-output.dto';
import { UsersFilterInputDto } from '../dtos/users-filter-input.dto';
import { IFindUsersFilters } from '../interfaces/find-users-filters.interface';
import { CreateUserInputDto } from '../dtos/create-user-input.dto';
import { NotFoundException } from '@nestjs/common';
import { IRole } from '../interfaces/users.interface';
import { RegisterProviderDto } from 'src/auth/dtos/register-provider-input.dto';

export class InMemoryUserRepository implements IUserRepository {
  private users: Users[] = [];

  async findOne(condition: Partial<Users>): Promise<Users | null> {
    return (
      this.users.find((user) =>
        Object.entries(condition).every(
          ([key, value]) => user[key as keyof Users] === value,
        ),
      ) || null
    );
  }

  async findOneById(id: string): Promise<Users | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findOneByEmail(email: string): Promise<Users | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async create(data: CreateUserInputDto): Promise<Users> {
    const newUser: Users = {
      id: (this.users.length + 1).toString(),
      email: data.email,
      password: data.password ?? null,
      googleId: null,
      microsoftId: null,
      facebookId: null,
      role: data.role || IRole.JOGADOR,
      createdAt: new Date(),
      updatedAt: new Date(),
      newsletter: true,
    };

    this.users.push(newUser);
    return { ...data, ...newUser };
  }

  // Utilizado apenas no teste de Registro usando um provider
  async createProvider(data: RegisterProviderDto): Promise<Users> {
    const newUser: Users = {
      id: (this.users.length + 1).toString(),
      email: data.email,
      password: null,
      googleId: null,
      microsoftId: null,
      facebookId: null,
      [`${data.provider}Id`]: data.providerId,
      role: IRole.JOGADOR,
      createdAt: new Date(),
      updatedAt: new Date(),
      newsletter: true,
    };

    this.users.push(newUser);
    return { ...data, ...newUser };
  }

  async update(id: string, data: Partial<Users>): Promise<Users> {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = {
      ...this.users[index],
      ...data,
      updatedAt: new Date(),
    };

    this.users[index] = updatedUser;
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    this.users.splice(index, 1);
  }

  async findAll(
    filterDto: UsersFilterInputDto,
  ): Promise<UserProfileOutputDto[]> {
    const { role, query } = filterDto;

    // Filtra os usuários com base nos critérios fornecidos
    let filteredUsers = this.users;

    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    if (query) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.email.includes(query) ||
          (user as any).profile?.name.includes(query) ||
          (user as any).profile?.username.includes(query),
      );
    }

    // Mapeia os dados retornados para o formato do DTO
    return filteredUsers.map((user) => ({
      id: user.id,
      email: user.email,
      name: (user as any).profile?.name || '',
      username: (user as any).profile?.username || '',
      avatarUrl: (user as any).profile?.avatarUrl || null,
      role: user.role,
      genre: (user as any).profile?.genre,
      birthDate: (user as any).profile?.birthDate,
      country: (user as any).profile?.country,
      region: (user as any).profile?.region,
      city: (user as any).profile?.city,
      createdAt: user.createdAt.toISOString(),
    }));
  }

  async findAllPaginated(
    filters: IFindUsersFilters,
  ): Promise<PaginatedOutputDto<UserProfileOutputDto>> {
    const { page = 1, perPage = 10, ...restFilters } = filters;

    // Cria um objeto que contém apenas os filtros válidos para a consulta
    const validFilters: Partial<Users> = {};

    // Itera sobre as chaves do `restFilters` e adiciona ao `validFilters` se a chave for válida
    for (const key of Object.keys(restFilters)) {
      if (key in restFilters) {
        // Aqui garantimos que estamos acessando apenas as chaves do tipo correto
        (validFilters as any)[key] = (restFilters as any)[key];
      }
    }

    // Filtra os usuários com base nos filtros fornecidos
    const filteredUsers = this.users.filter((user) => {
      return Object.entries(validFilters).every(
        ([key, value]) => user[key as keyof Users] === value,
      );
    });

    // Paginação
    const total = filteredUsers.length;
    const startIndex = (page - 1) * perPage;
    const paginatedUsers = filteredUsers.slice(
      startIndex,
      startIndex + perPage,
    );

    // Mapeia os dados retornados para o formato do DTO
    const data = paginatedUsers.map((user) => ({
      id: user.id,
      email: user.email,
      name: (user as any).profile?.name || '',
      username: (user as any).profile?.username || '',
      avatarUrl: (user as any).profile?.avatarUrl || null,
      role: user.role,
      genre: (user as any).profile?.genre,
      birthDate: (user as any).profile?.birthDate,
      country: (user as any).profile?.country,
      region: (user as any).profile?.region,
      city: (user as any).profile?.city,
      createdAt: user.createdAt.toISOString(),
    }));

    // Retorna o resultado paginado
    return {
      data,
      meta: {
        total,
        lastPage: Math.ceil(total / perPage),
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page * perPage < total ? page + 1 : null,
      },
    };
  }
}
