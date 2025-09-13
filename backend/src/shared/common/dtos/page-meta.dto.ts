import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export abstract class PageMetaDto {
  @ApiProperty()
  readonly take: number;

  @ApiPropertyOptional()
  readonly meta: object;

  constructor(take: number, meta?: object) {
    this.take = take;
    this.meta = meta;
  }
}
