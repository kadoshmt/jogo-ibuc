import { Injectable } from '@nestjs/common';
import { DEFAULT_AVATAR_URLS } from '../constants/avatar.constants';
import { IGenre } from 'src/profile/interfaces/profile.interface';

@Injectable()
export class AvatarService {
  private readonly maleAvatars: string[] = DEFAULT_AVATAR_URLS.MALE;
  private readonly femaleAvatars: string[] = DEFAULT_AVATAR_URLS.FEMALE;
  private readonly defaultAvatar: string = DEFAULT_AVATAR_URLS.DEFAULT;

  getAvatarUrl(genre: IGenre | null): string {
    if (genre === IGenre.MASCULINO) {
      return this.getRandomAvatar(this.maleAvatars);
    } else if (genre === IGenre.FEMININO) {
      return this.getRandomAvatar(this.femaleAvatars);
    } else {
      return this.defaultAvatar;
    }
  }

  private getRandomAvatar(avatarList: string[]): string {
    const randomIndex = Math.floor(Math.random() * avatarList.length);
    return avatarList[randomIndex];
  }
}
