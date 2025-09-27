import { ApiProperty } from '@nestjs/swagger';

export class OffsetBasedMetaDto{
  @ApiProperty({
    example: 1,
  })
  readonly page: number;

  @ApiProperty({
    example: 10,
  })
  readonly take: number;

  @ApiProperty({
    example: 100,
  })
  readonly itemCount: number;

  @ApiProperty({
    example: 10,
  })
  readonly pageCount: number;

  // @ApiProperty({
  //   example: true,
  // })
  // readonly hasPreviousPage: boolean;

  // @ApiProperty({
  //   example: false,
  // })
  // readonly hasNextPage: boolean;
  constructor(itemCount: number, page: number, take: number) {
    this.take = take;
    this.page = page;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(itemCount / take);
    // this.hasPreviousPage = this.page > 1;
    // this.hasNextPage = this.page < this.pageCount;
  }
}

export class OffsetBasedPageDto<T> {
  @ApiProperty({ isArray: true })
  items: T[];
  @ApiProperty({ type: () => OffsetBasedMetaDto })
  meta: OffsetBasedMetaDto;

  constructor(items: T[], count: number, page: number, take: number) {
    this.items = items;
    this.meta = new OffsetBasedMetaDto(count, page, take);
  }
}
