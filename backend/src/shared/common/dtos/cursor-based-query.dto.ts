import { IsOptional, IsEnum, IsDate } from 'class-validator';
import { Direction } from '../enums/direction.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PageQueryDto } from './page-query.dto';
import { TCursor } from '../types/cursor.type';

export class CursorBasedQueryDto extends PageQueryDto{
  @ApiProperty({
    description: 'Cursor for pagination',
    type: Date,
    example: '2025-01-01T00:00:00Z',
    required: false,
    default: new Date()
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  cursor?: TCursor = new Date();

  @ApiProperty({
    description: 'Direction for pagination',
    enum: Direction,
    example: Direction.NEXT,
    required: false,
    default: Direction.NEXT
  })
  @IsOptional()
  @IsEnum(Direction)
  direction?: Direction = Direction.NEXT;
}