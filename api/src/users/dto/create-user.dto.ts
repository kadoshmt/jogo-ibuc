import { IsEmail, IsOptional } from 'class-validator';
import { RoleUser } from '../interfaces/role-user.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  // @IsNotEmpty()
  // @Matches(/^[a-zA-Z0-9_]+$/, {
  //   message:
  //     'Username deve conter apenas letras, números, and underscores ("_")',
  // })
  // username: string;

  @IsOptional()
  password?: string;

  // @IsNotEmpty()
  // name: string;

  @IsOptional()
  googleId?: string;

  @IsOptional()
  microsoftId?: string;

  @IsOptional()
  facebookId?: string;

  // @IsOptional()
  // avatar?: string;

  @IsOptional()
  role?: RoleUser;
}
