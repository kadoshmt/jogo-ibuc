import { IsOptional, IsEnum, IsString } from 'class-validator';
import { RoleUser } from '../interfaces/role-user.enum';

export class UsersFilterInputDto {
  @IsOptional()
  @IsEnum(RoleUser, {
    message: 'Role must be one of: ADMIN, COLLABORATOR, PLAYER',
  })
  role?: RoleUser;

  @IsOptional()
  @IsString()
  query?: string;
}
