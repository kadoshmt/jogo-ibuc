import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from 'src/shared/database/prisma.service';
import { IProfileRepository } from '../interfaces/profile-repository.interface';
import { CreateProfileInputDto } from '../dtos/create-profile-input.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaProfileRepository implements IProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  // async findById(id: string): Promise<Profile | null> {
  //   return this.prisma.profile.findUnique({ where: { id } });
  // }

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { userId } });
  }

  async findByUsername(username: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { username } });
  }

  async create(profileData: CreateProfileInputDto): Promise<Profile> {
    return this.prisma.profile.create({
      data: {
        name: profileData.name,
        username: profileData.username,
        avatarUrl: profileData.avatarUrl,
        genre: profileData.genre,
        birthDate: profileData.birthDate,
        country: profileData.country,
        region: profileData.region,
        city: profileData.city,
        user: {
          connect: { id: profileData.userId },
        },
      },
    });
  }

  async update(
    userId: string,
    profileData: Partial<Profile>,
  ): Promise<Profile> {
    return this.prisma.profile.update({
      where: { userId },
      data: profileData,
    });
  }

  async delete(userId: string): Promise<void> {
    try {
      await this.prisma.profile.delete({ where: { userId } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Profile with userId ${userId} not found`);
      }
      // Re-lança outras exceções para serem tratadas em outro lugar
      throw error;
    }
  }
}
