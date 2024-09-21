import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Genre } from '@prisma/client';

export class UpdateProfileInputDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username must contain only letters, numbers and underscores ("_")',
  })
  username?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  birthDate?: string;

  @IsNotEmpty()
  @IsEnum(Genre, {
    message: 'Genre must be one of: MASCULINO, FEMININO',
  })
  genre: Genre;
}
