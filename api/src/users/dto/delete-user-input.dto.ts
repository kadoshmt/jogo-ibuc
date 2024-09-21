import { IsNotEmpty, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class DeleteUserInputDto {
  @IsNotEmpty()
  @IsUUID(4)
  @Transform(({ value }) => value.trim())
  userId: string;

  @IsNotEmpty()
  @IsUUID(4)
  @Transform(({ value }) => value.trim())
  transferUserId: string;
}
