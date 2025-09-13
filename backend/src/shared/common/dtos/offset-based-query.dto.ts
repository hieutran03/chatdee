import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { PageQueryDto } from './page-query.dto';

export class OffsetBasedQueryDto extends PageQueryDto{
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
