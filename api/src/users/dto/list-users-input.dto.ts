import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { RoleUser } from '../interfaces/role-user.enum';
import { Genre } from '@prisma/client';

export class ListUsersInputDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  })
  page?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  })
  perPage?: number;

  @IsOptional()
  @IsUUID(4)
  @Transform(({ value }) => value.trim().toLowerCase())
  id: string;

  @IsOptional()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username must contain only letters, numbers and underscores ("_")',
  })
  @Transform(({ value }) => value.trim())
  username: string;

  @IsOptional()
  @IsEnum(RoleUser, {
    message: 'Role must be one of: ADMIN, COLLABORATOR, PLAYER, TEACHER',
  })
  role: RoleUser;

  @IsOptional()
  @IsEnum(Genre, {
    message: 'Genre must be one of: MASCULINO, FEMININO',
  })
  genre?: Genre;
}
