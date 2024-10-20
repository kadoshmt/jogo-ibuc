import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordInputDTO {
  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim().toLowerCase() : value))
  token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Transform(({ value }) => (value ? value.trim() : value))
  password: string;
}
