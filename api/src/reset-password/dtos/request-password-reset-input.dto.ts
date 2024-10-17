import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestPasswordResetInputDto {
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;
}
