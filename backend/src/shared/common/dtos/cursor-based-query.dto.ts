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
    example: new Date(),
    required: false,
    default: new Date()
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  cursor?: TCursor = new Date();

  // @ApiProperty({
  //   description: 'Direction for pagination',
  //   enum: Direction,
  //   example: Direction.PREV,
  //   required: false,
  // })
  // @IsOptional()
  // @IsEnum(Direction)
  // direction?: Direction = Direction.PREV;
}