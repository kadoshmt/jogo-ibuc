import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Genre } from '@prisma/client';
import { IGenre } from '../interfaces/profile.interface';

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

  @IsOptional()
  @IsString()
  @Matches(/^(?:\+\d{1,3}\s?)?\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message:
      'Phone number must be in one of the formats: (99) 9999-9999, (99) 99999-9999, +999 (99) 9999-9999, +999 (99) 99999-9999',
  })
  @Transform(({ value }) => value.trim())
  phone?: string;
}
