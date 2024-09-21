import { Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from 'src/shared/database/prisma.service';
import { IProfileRepository } from '../interfaces/profile-repository.interface';
import { CreateProfileInputDto } from '../dto/create-profile-input.dto';

@Injectable()
export class PrismaProfileRepository implements IProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { id } });
  }

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
    await this.prisma.profile.delete({ where: { userId } });
  }
}
