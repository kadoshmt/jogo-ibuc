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
  @Transform(({ value }) => (value ? value.trim() : undefined))
  password: string;

  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim() : undefined))
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username must contain only letters, numbers and underscores ("_")',
  })
  @Transform(({ value }) => (value ? value.trim() : undefined))
  username: string;

  @IsNotEmpty()
  @IsEnum(Role, {
    message: 'Role must be one of: ADMIN, COLABORADOR, JOGADOR, PROFESSOR',
  })
  role: Role;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? value.trim() : undefined))
  googleId?: string;

  @IsNotEmpty()
  @IsEnum(Genre, {
    message: 'Genre must be one of: MASCULINO, FEMININO',
  })
  genre: Genre | IGenre;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? value.trim() : undefined))
  country?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? value.trim() : undefined))
  region?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? value.trim() : undefined))
  city?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(?:\+\d{1,3}\s?)?\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message:
      'Phone number must be in one of the formats: (99) 9999-9999, (99) 99999-9999, +999 (99) 9999-9999, +999 (99) 99999-9999',
  })
  @Transform(({ value }) =>
    value && value.trim() !== '' ? value.trim() : undefined,
  )
  phone?: string;
}
