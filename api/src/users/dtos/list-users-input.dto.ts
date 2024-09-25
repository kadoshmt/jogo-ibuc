import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { Genre, Role } from '@prisma/client';
import { IGenre } from 'src/profile/interfaces/profile.interface';

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
  id?: string;

  @IsOptional()
  @Transform(({ value }) => value.trim().toLowerCase())
  email?: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username must contain only letters, numbers and underscores ("_")',
  })
  @Transform(({ value }) => value.trim())
  username?: string;

  @IsOptional()
  @IsEnum(Role, {
    message: 'Role must be one of: ADMIN, COLABORADOR, JOGADOR, PROFESSOR',
  })
  role?: Role;

  @IsOptional()
  @IsEnum(Genre, {
    message: 'Genre must be one of: MASCULINO, FEMININO',
  })
  genre?: Genre | IGenre;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  country?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  region?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  city?: string;
}
