export class RegisterProviderDto {
  email: string;
  name: string;
  avatarUrl?: string;
  username: string;
  provider: 'google' | 'microsoft' | 'facebook';
  providerId: string;
  newsletter?: boolean;
}
