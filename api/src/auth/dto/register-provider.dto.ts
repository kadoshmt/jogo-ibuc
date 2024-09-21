export class RegisterProviderDto {
  email: string;
  name: string;
  avatar?: string;
  username: string;
  provider: 'google' | 'microsoft' | 'facebook';
  providerId: string;
}
