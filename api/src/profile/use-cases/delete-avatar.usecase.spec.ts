import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteAvatarUseCase } from './delete-avatar.usecase';
import { InMemoryProfileRepository } from '../repositories/in-memory-profile.repository';
import { FakeUploaderService } from '@shared/storage/fake-uploader.service';
import { Profile } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { getAvatarUrl } from '@src/common/utils/avatar.util';
import { IGenre } from '../interfaces/profile.interface';

describe('DeleteAvatarUseCase', () => {
  let deleteAvatarUseCase: DeleteAvatarUseCase;
  let profileRepository: InMemoryProfileRepository;
  let uploaderService: FakeUploaderService;

  beforeEach(() => {
    profileRepository = new InMemoryProfileRepository();
    uploaderService = new FakeUploaderService();
    deleteAvatarUseCase = new DeleteAvatarUseCase(
      profileRepository,
      uploaderService,
    );
  });

  it('deve deletar o avatar se pertencer ao armazenamento e atualizar o perfil', async () => {
    const profile: Profile = {
      id: 'profile-1',
      userId: 'user-1',
      name: 'John Doe',
      username: 'johndoe',
      avatarUrl: 'https://fake-storage.com/old-avatar.png',
      genre: IGenre.MASCULINO,
      birthDate: null,
      country: null,
      region: null,
      city: null,
      phone: null,
    };

    await profileRepository.create(profile);

    // Adiciona o avatar antigo ao uploads do FakeUploaderService
    uploaderService.uploads.push({
      fileName: 'old-avatar.png',
      url: profile.avatarUrl!,
    });

    // Espiona os métodos
    const deleteSpy = vi.spyOn(uploaderService, 'delete');
    const isOwnStorageUrlSpy = vi.spyOn(uploaderService, 'isOwnStorageUrl');

    const result = await deleteAvatarUseCase.execute('user-1');

    expect(isOwnStorageUrlSpy).toHaveBeenCalledWith(profile.avatarUrl);
    expect(deleteSpy).toHaveBeenCalledWith(profile.avatarUrl);

    const updatedProfile = await profileRepository.findByUserId('user-1');
    expect(updatedProfile?.avatarUrl).toBe(getAvatarUrl(null));

    // Verifica se o avatar foi removido do uploaderService
    expect(uploaderService.uploads.length).toBe(0);

    // Verifica o valor retornado
    expect(result.avatarUrl).toBe(profile.avatarUrl);
  });

  it('não deve deletar o avatar se não pertencer ao armazenamento, mas deve atualizar o perfil', async () => {
    const profile: Profile = {
      id: 'profile-1',
      userId: 'user-1',
      name: 'Jane Doe',
      username: 'janedoe',
      avatarUrl: 'https://external-storage.com/old-avatar.png',
      genre: IGenre.FEMININO,
      birthDate: null,
      country: null,
      region: null,
      city: null,
      phone: null,
    };

    await profileRepository.create(profile);

    // Espiona os métodos
    const deleteSpy = vi.spyOn(uploaderService, 'delete');
    const isOwnStorageUrlSpy = vi.spyOn(uploaderService, 'isOwnStorageUrl');

    const result = await deleteAvatarUseCase.execute('user-1');

    expect(isOwnStorageUrlSpy).toHaveBeenCalledWith(profile.avatarUrl);
    expect(deleteSpy).not.toHaveBeenCalled();

    const updatedProfile = await profileRepository.findByUserId('user-1');
    expect(updatedProfile?.avatarUrl).toBe(getAvatarUrl(null));

    // Verifica se o avatar não foi removido (pois não estava no uploaderService)
    expect(uploaderService.uploads.length).toBe(0);

    // Verifica o valor retornado
    expect(result.avatarUrl).toBe(profile.avatarUrl);
  });

  it('deve lançar NotFoundException se o perfil não existir', async () => {
    await expect(
      deleteAvatarUseCase.execute('non-existent-user'),
    ).rejects.toThrow(NotFoundException);
  });
});
