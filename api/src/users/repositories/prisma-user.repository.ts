import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { PrismaService } from 'src/shared/database/prisma.service';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserProfileOutputDto } from '../dto/user-profile-output.dto';
import { UserFilterInputDto } from '../dto/user-filter-input.dto';
import { IFindUsersFilters } from '../interfaces/find-users-filters.interface';
import { PaginatedOutputDto } from 'src/common/dtos/paginated-output.dto';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly prismaUsers = this.prismaService.user;
  private prisma = new PrismaClient();

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOne(condition: Partial<User>): Promise<User | null> {
    return this.prisma.user.findFirst({ where: condition });
  }

  // async findAll(condition: Partial<User>): Promise<User[]> {
  //   return this.prisma.user.findMany({ where: condition });
  // }

  async findAll(
    filterDto: UserFilterInputDto,
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

    const users = await this.prisma.user.findMany({
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
        name: user.profile?.name || '', // Verifica se o perfil existe
        username: user.profile?.username || '', // Verifica se o perfil existe
        avatar: user.profile?.avatar || null, // Verifica se o perfil existe
        role: user.role,
      } as UserProfileOutputDto;
    });
  }

  async findAllPaginated(
    filters: IFindUsersFilters,
  ): Promise<PaginatedOutputDto<UserProfileOutputDto>> {
    const where: Prisma.UserFindManyArgs['where'] = {};

    // Itera sobre cada chave de `filters` e adiciona ao `where` se a chave for válida
    for (const key in filters) {
      if (filters.hasOwnProperty(key) && key !== 'page' && key !== 'perPage') {
        (where as any)[key] = (filters as any)[key];
      }
    }
    const paginate = createPaginator({ perPage: filters.perPage ?? 10 });

    return paginate<UserProfileOutputDto, Prisma.UserFindManyArgs>(
      this.prismaUsers,
      {
        where,
        orderBy: {
          id: 'desc',
        },
      },
      {
        page: filters.page ?? 1,
      },
    );
  }

  // async findAllPaginated(filter: PaginationFilter): Promise<User[]> {
  //   const where = filter.conditions?.reduce(
  //     (acc: Record<string, any>, condition) => {
  //       acc[condition.column] = { [condition.condition]: condition.value };
  //       return acc;
  //     },
  //     {},
  //   );

  //   const sort =
  //     filter.sort === 'asc' || filter.sort === 'desc' ? filter.sort : 'desc';

  //   const skip = filter.page === 1 ? 0 : (filter.page - 1) * filter.perPage;

  //   const paginate = createPaginator({ perPage: condition.perPage });
  //   return paginate<UserResponseDto, Prisma.UsersFindManyArgs>(
  //     UserResponseDto,
  //     {
  //      where: {},
  //       orderBy: {
  //         id: 'desc',
  //       },
  //     },
  //     {
  //       page,
  //     },
  //   );

  //   const result = await this.prisma.user.findMany({
  //     skip: skip,
  //     take: filter.perPage,
  //     where: where,
  //     orderBy: {
  //       createdAt: sort,
  //     },
  //   });

  //   return result;
  // }

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
