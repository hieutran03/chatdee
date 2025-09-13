import { IsOptional, IsEnum, IsDate } from 'class-validator';
import { Direction } from '../enums/direction.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PageQueryDto } from './page-query.dto';

export class CursorBasedQueryDto extends PageQueryDto{
  @ApiProperty({
    description: 'Cursor for pagination',
    type: Date,
    example: '2025-01-01T00:00:00Z'
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  cursor?: Date = new Date();

  @IsOptional()
  @IsEnum(Direction)
  direction?: Direction = Direction.NEXT;
}