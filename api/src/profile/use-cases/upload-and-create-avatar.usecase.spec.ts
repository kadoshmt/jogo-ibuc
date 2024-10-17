import { describe, it, expect, beforeEach } from 'vitest';
import { UploadAndCreateAvatarUseCase } from './upload-and-create-avatar.usecase';
import { InMemoryProfileRepository } from '../repositories/in-memory-profile.repository';
import { FakeUploaderService } from 'src/shared/storage/fake-uploader.service';
import { Profile } from '@prisma/client';
import { InvalidType } from 'src/common/exceptions/invalid-type.exception';
import { IGenre } from '../interfaces/profile.interface';
import { NotFoundException } from '@nestjs/common';

describe('UploadAndCreateAvatarUseCase', () => {
  let uploadAndCreateAvatarUseCase: UploadAndCreateAvatarUseCase;
  let profileRepository: InMemoryProfileRepository;
  let uploaderService: FakeUploaderService;

  beforeEach(() => {
    profileRepository = new InMemoryProfileRepository();
    uploaderService = new FakeUploaderService();
    uploadAndCreateAvatarUseCase = new UploadAndCreateAvatarUseCase(
      profileRepository,
      uploaderService,
    );
  });

  it('deve fazer upload de uma imagem válida, atualizar o avatar do perfil e deletar o avatar antigo', async () => {
    const profile: Profile = {
      id: 'profile-1',
      userId: 'user-1',
      name: 'John Doe',
      username: 'johndoe',
      avatarUrl: 'https://fake-storage.com/old-avatar.png', // URL antiga pertencente ao armazenamento
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

    // Espiona o método delete do uploaderService
    const deleteSpy = vi.spyOn(uploaderService, 'delete');

    const fileData = {
      userId: 'user-1',
      fileName: 'new-avatar.png',
      fileType: 'image/png',
      body: Buffer.from('fake-image-content'),
    };

    const result = await uploadAndCreateAvatarUseCase.execute(fileData);

    expect(result).toHaveProperty('avatarUrl');

    // Verifica se o método delete foi chamado com a URL antiga
    expect(deleteSpy).toHaveBeenCalledWith(profile.avatarUrl);

    const updatedProfile = await profileRepository.findByUserId('user-1');
    expect(updatedProfile?.avatarUrl).toBe(result.avatarUrl);
  });

  it('não deve tentar deletar o avatar antigo se a URL não pertencer ao armazenamento', async () => {
    const profile: Profile = {
      id: 'profile-1',
      userId: 'user-1',
      name: 'John Doe',
      username: 'johndoe',
      avatarUrl: 'https://external-storage.com/old-avatar.png', // URL externa
      genre: IGenre.MASCULINO,
      birthDate: null,
      country: null,
      region: null,
      city: null,
      phone: null,
    };

    await profileRepository.create(profile);

    // Espiona o método delete do uploaderService
    const deleteSpy = vi.spyOn(uploaderService, 'delete');

    const fileData = {
      userId: 'user-1',
      fileName: 'new-avatar.png',
      fileType: 'image/png',
      body: Buffer.from('fake-image-content'),
    };

    const result = await uploadAndCreateAvatarUseCase.execute(fileData);

    expect(result).toHaveProperty('avatarUrl');

    // Verifica se o método delete não foi chamado
    expect(deleteSpy).not.toHaveBeenCalled();

    const updatedProfile = await profileRepository.findByUserId('user-1');
    expect(updatedProfile?.avatarUrl).toBe(result.avatarUrl);
  });

  it('deve lançar InvalidType se o tipo de arquivo for inválido', async () => {
    const fileData = {
      userId: 'user-1',
      fileName: 'document.pdf',
      fileType: 'application/pdf',
      body: Buffer.from('fake-pdf-content'),
    };

    await expect(
      uploadAndCreateAvatarUseCase.execute(fileData),
    ).rejects.toThrow(InvalidType);
  });

  it('deve lançar erro se o perfil não existir', async () => {
    const fileData = {
      userId: 'non-existent-user',
      fileName: 'avatar.png',
      fileType: 'image/png',
      body: Buffer.from('fake-image-content'),
    };

    await expect(
      uploadAndCreateAvatarUseCase.execute(fileData),
    ).rejects.toThrow(
      NotFoundException, // Substitua por uma exceção específica se houver
    );
  });
});
