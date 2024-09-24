import { Genre } from '@prisma/client';
import { DEFAULT_AVATAR_URLS } from '../constants/avatar.constants';
import { IGenre } from 'src/profile/interfaces/profile.interface';

export const getAvatarUrl = (genre: Genre | IGenre | null): string => {
  switch (genre) {
    case IGenre.MASCULINO:
      return getRandomAvatar(DEFAULT_AVATAR_URLS.MALE);
    case IGenre.FEMININO:
      return getRandomAvatar(DEFAULT_AVATAR_URLS.FEMALE);
    default:
      return DEFAULT_AVATAR_URLS.DEFAULT;
  }
};

const getRandomAvatar = (avatarList: string[]): string => {
  const randomIndex = Math.floor(Math.random() * avatarList.length);
  return avatarList[randomIndex];
};
