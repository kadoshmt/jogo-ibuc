import { config } from 'dotenv';
config();

const avatarUrl = process.env.DEFAULT_AVATAR_URL;

export const DEFAULT_AVATAR_URLS = {
  MALE: [
    `${avatarUrl}male1.png`,
    `${avatarUrl}male2.png`,
    `${avatarUrl}male3.png`,
  ],
  FEMALE: [
    `${avatarUrl}female1.png`,
    `${avatarUrl}female2.png`,
    `${avatarUrl}female3.png`,
  ],
  DEFAULT: `${avatarUrl}default.png`,
};
