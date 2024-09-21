import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class UsernameInputDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username must contain only letters, numbers and underscores ("_")',
  })
  @Transform(({ value }) => value.trim())
  username: string;
}
