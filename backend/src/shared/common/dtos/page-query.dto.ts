import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PageQueryDto {
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly limit?: number = 10;

  //   @ApiPropertyOptional()
  // @Type(() => String)
  // @IsString()
  // @IsOptional()
  // readonly q?: string;

  // @ApiPropertyOptional({ default: false })
  // @Type(() => Boolean)
  // @IsBoolean()
  // @IsOptional()
  // readonly isActive?: boolean = true;
}
