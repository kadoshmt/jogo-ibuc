import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'O username deve conter apenas letras, números e underscores',
  })
  username?: string;

  // @IsOptional()
  // @IsString()
  // avatar?: string;
}
