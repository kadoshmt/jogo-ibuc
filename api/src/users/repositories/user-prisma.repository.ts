import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { PaginationFilter } from 'src/common/dtos/pagination-filter.dto';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly prismaUsers = this.prismaService.user;
  private prisma = new PrismaClient();

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findOne(condition: Partial<User>): Promise<User | null> {
    return this.prisma.user.findFirst({ where: condition });
  }

  async findAll(filter: PaginationFilter): Promise<User[]> {
    const where = filter.conditions?.reduce(
      (acc: Record<string, any>, condition) => {
        acc[condition.column] = { [condition.condition]: condition.value };
        return acc;
      },
      {},
    );

    const sort =
      filter.sort === 'asc' || filter.sort === 'desc' ? filter.sort : 'desc';

    const skip = filter.page === 1 ? 0 : (filter.page - 1) * filter.perPage;

    // const paginate = createPaginator({ perPage: condition.perPage });
    // return paginate<UserResponseDto, Prisma.UsersFindManyArgs>(
    //   UserResponseDto,
    //   {
    //    where: {},
    //     orderBy: {
    //       id: 'desc',
    //     },
    //   },
    //   {
    //     page,
    //   },
    // );

    const result = await this.prisma.user.findMany({
      skip: skip,
      take: filter.perPage,
      where: where,
      orderBy: {
        createdAt: sort,
      },
    });

    return result;
  }

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
