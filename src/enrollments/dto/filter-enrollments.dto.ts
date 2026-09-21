import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class FilterEnrollmentsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  studentId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  courseId?: number;
}
