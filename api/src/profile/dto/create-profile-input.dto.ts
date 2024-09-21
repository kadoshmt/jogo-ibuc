import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty, Matches } from 'class-validator';

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
  avatar?: string;
}
