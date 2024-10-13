import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IProfileRepository } from '../interfaces/profile-repository.interface';
import { Profile } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export class InMemoryProfileRepository implements IProfileRepository {
  private profiles: Profile[] = [];

  // async findById(id: string): Promise<Profile | null> {
  //   return this.profiles.find((profile) => profile.id === id) || null;
  // }

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.profiles.find((profile) => profile.userId === userId) || null;
  }

  async findByUsername(username: string): Promise<Profile | null> {
    return (
      this.profiles.find((profile) => profile.username === username) || null
    );
  }

  async create(profileData: Partial<Profile>): Promise<Profile> {
    const newProfile: Profile = {
      id: uuidv4(),
      userId: profileData.userId!,
      name: profileData.name!,
      username: profileData.username!,
      avatarUrl: profileData.avatarUrl ?? null,
      genre: profileData.genre!,
      birthDate: profileData.birthDate ?? null,
      country: profileData.country ?? null,
      region: profileData.region ?? null,
      city: profileData.city ?? null,
      phone: profileData.phone ?? null,
    };

    this.profiles.push(newProfile);
    return newProfile;
  }

  async update(
    userId: string,
    profileData: Partial<Profile>,
  ): Promise<Profile> {
    const index = this.profiles.findIndex(
      (profile) => profile.userId === userId,
    );

    if (index === -1) {
      throw new BadRequestException('Profile not found');
    }

    const updatedProfile = {
      ...this.profiles[index],
      ...profileData,
    };

    this.profiles[index] = updatedProfile;
    return updatedProfile;
  }

  async delete(userId: string): Promise<void> {
    const index = this.profiles.findIndex(
      (profile) => profile.userId === userId,
    );

    if (index === -1) {
      throw new NotFoundException(`Profile with userId ${userId} not found`);
    }

    this.profiles.splice(index, 1);
  }
}
