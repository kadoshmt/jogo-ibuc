import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class UsersFilterInputDto {
  @IsOptional()
  @IsEnum(Role, {
    message: 'Role must be one of: ADMIN, COLABORADOR, JOGADOR, PROFESSOR',
  })
  role?: Role;

  @IsOptional()
  @IsString()
  query?: string;
}
