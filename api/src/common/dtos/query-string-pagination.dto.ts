import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class QueryStringPaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => value || 1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => value || 10)
  perPage?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || 'desc')
  sort?: 'desc' | 'asc';

  @IsOptional()
  @IsString()
  q?: string;
}
