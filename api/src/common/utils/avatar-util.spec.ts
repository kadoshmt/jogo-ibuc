import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAvatarUrl } from './avatar.util'; // Certifique-se de que o caminho esteja correto
import { Genre } from '@prisma/client';

// Mocka as variáveis de ambiente antes de importar o módulo que as usa
process.env.DEFAULT_AVATAR_URL = 'http://localhost:3000/images/';

describe('getAvatarUrl', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // Mocka Math.random() para retornar sempre o primeiro valor
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Limpa todos os mocks após cada teste
  });

  it('should return a male avatar URL for MASCULINO genre', () => {
    const avatarUrl = getAvatarUrl(Genre.MASCULINO);
    expect(avatarUrl).toBe(`${process.env.DEFAULT_AVATAR_URL}male1.png`);
  });

  it('should return a female avatar URL for FEMININO genre', () => {
    const avatarUrl = getAvatarUrl(Genre.FEMININO);
    expect(avatarUrl).toBe(`${process.env.DEFAULT_AVATAR_URL}female1.png`);
  });

  it('should return the default avatar URL for null genre', () => {
    const avatarUrl = getAvatarUrl(null);
    expect(avatarUrl).toBe(
      `${process.env.DEFAULT_AVATAR_URL}default-avatar.png`,
    );
  });

  it('should return the default avatar URL for NAO_INFORMADO genre', () => {
    const avatarUrl = getAvatarUrl(Genre.NAO_INFORMADO);
    expect(avatarUrl).toBe(
      `${process.env.DEFAULT_AVATAR_URL}default-avatar.png`,
    );
  });
});
