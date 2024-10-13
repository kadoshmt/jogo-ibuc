import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePasswordInputDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Transform(({ value }) => value.trim())
  password: string;
}
