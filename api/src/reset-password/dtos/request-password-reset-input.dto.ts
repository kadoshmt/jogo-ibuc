import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestPasswordResetInputDto {
  @IsEmail()
  @Transform(({ value }) => (value ? value.trim().toLowerCase() : value))
  email: string;
}
