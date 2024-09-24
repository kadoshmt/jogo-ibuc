import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Genre, Role } from '@prisma/client';
import { IGenre } from 'src/profile/interfaces/profile.interface';

export class CreateUserInputDto {
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username must contain only letters, numbers and underscores ("_")',
  })
  @Transform(({ value }) => value.trim())
  username: string;

  @IsNotEmpty()
  @IsEnum(Role, {
    message: 'Role must be one of: ADMIN, COLABORADOR, JOGADOR, PROFESSOR',
  })
  role: Role;

  @IsNotEmpty()
  @IsEnum(Genre, {
    message: 'Genre must be one of: MASCULINO, FEMININO',
  })
  genre: Genre | IGenre;

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
