import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { RoleUser } from '../interfaces/role-user.enum';
import { Transform } from 'class-transformer';
import { Genre } from '@prisma/client';

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
  @IsEnum(RoleUser, {
    message: 'Role must be one of: ADMIN, COLABORADOR, JOGADOR, PROFESSOR',
  })
  role: RoleUser;

  @IsNotEmpty()
  @IsEnum(Genre, {
    message: 'Genre must be one of: MASCULINO, FEMININO',
  })
  genre: Genre;
}
