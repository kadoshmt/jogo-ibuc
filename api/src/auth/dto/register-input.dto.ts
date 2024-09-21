import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsString,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Genre } from '@prisma/client';

export class RegisterInputDto {
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
  @IsEnum(Genre, {
    message: 'Genre must be one of: MASCULINO, FEMININO',
  })
  genre: Genre;
}
