import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, Users } from '@prisma/client';
import { PrismaService } from 'src/shared/database/prisma.service';
import { IUserRepository } from '../interfaces/user-repository.interface';

import { UserProfileOutputDto } from '../dtos/user-profile-output.dto';
import { UsersFilterInputDto } from '../dtos/users-filter-input.dto';
import { IFindUsersFilters } from '../interfaces/find-users-filters.interface';
import { PaginatedOutputDto } from 'src/common/dtos/paginated-output.dto';
import { createPaginator } from 'prisma-pagination';
import { CreateUserInputDto } from '../dtos/create-user-input.dto';
import { getAvatarUrl } from 'src/common/utils/avatar.util';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private prisma = new PrismaClient();

  async findOneById(id: string): Promise<Users | null> {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<Users | null> {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async findOne(condition: Partial<Users>): Promise<Users | null> {
    return this.prisma.users.findFirst({ where: condition });
  }

  async create(data: CreateUserInputDto): Promise<Users> {
    return this.prisma.users.create({ data });
  }

  async update(id: string, data: Partial<Users>): Promise<Users> {
    return this.prisma.users.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.users.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      // Re-lança outras exceções para serem tratadas em outro lugar
      throw error;
    }
  }

  async findAll(
    filterDto: UsersFilterInputDto,
  ): Promise<UserProfileOutputDto[]> {
    const { role, query } = filterDto;

    // Objeto de condições dinâmicas
    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (query) {
      where.OR = [
        { email: { contains: query, mode: 'insensitive' } },
        { profile: { name: { contains: query, mode: 'insensitive' } } },
        { profile: { username: { contains: query, mode: 'insensitive' } } },
      ];
    }

    const users = await this.prisma.users.findMany({
      where,
      include: {
        profile: true,
      },
    });

    // Mapeia os dados retornados para o formato do DTO
    return users.map((user) => {
      return {
        id: user.id,
        email: user.email,
        name: user.profile?.name || '',
        username: user.profile?.username || '',
        avatarUrl: user.profile?.avatarUrl ?? getAvatarUrl(null),
        role: user.role,
        genre: user.profile?.genre,
        birthDate: user.profile?.birthDate,
        country: user.profile?.country,
        region: user.profile?.region,
        city: user.profile?.city,
        phone: user.profile?.phone,
        createdAt: user.createdAt.toISOString(),
      } as UserProfileOutputDto;
    });
  }

  async findAllPaginated(
    filters: IFindUsersFilters,
  ): Promise<PaginatedOutputDto<UserProfileOutputDto>> {
    const where: Prisma.UsersFindManyArgs['where'] = {};

    // Itera sobre cada chave de `filters` e adiciona ao `where` se a chave for válida
    for (const key in filters) {
      if (filters.hasOwnProperty(key) && key !== 'page' && key !== 'perPage') {
        (where as any)[key] = (filters as any)[key];
      }
    }

    // Definindo a seleção dos campos com base no DTO desejado
    const select: Prisma.UsersSelect = {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      profile: {
        select: {
          name: true,
          username: true,
          avatarUrl: true,
          genre: true,
          birthDate: true,
          country: true,
          region: true,
          city: true,
          phone: true,
        },
      },
    };

    const paginate = createPaginator({ perPage: filters.perPage ?? 10 });

    return paginate<UserProfileOutputDto, Prisma.UsersFindManyArgs>(
      this.prisma.users,
      {
        where,
        select,
        orderBy: {
          createdAt: 'desc',
        },
      },
      {
        page: filters.page ?? 1,
      },
    );
  }
}
