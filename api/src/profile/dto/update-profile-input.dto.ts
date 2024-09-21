import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches } from 'class-validator';

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
  avatar?: string;
}
