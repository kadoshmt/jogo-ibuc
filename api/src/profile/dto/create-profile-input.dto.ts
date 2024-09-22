import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  Matches,
  IsEnum,
} from 'class-validator';
import { Genre } from '@prisma/client';

export class CreateProfileInputDto {
  @IsString()
  userId: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username must contain only letters, numbers and underscores ("_")',
  })
  @Transform(({ value }) => value.trim())
  username: string;

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
    message: 'Genre must be one of: MASCULINO or FEMININO',
  })
  genre: Genre;

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
