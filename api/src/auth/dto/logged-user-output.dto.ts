export class LoggedUserOutputDto {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string;
  role: string;
  createdAt?: Date;
}
