import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './page-meta.dto';


export class OffsetBasedMetaDto extends PageMetaDto{
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor(count: number, page: number, take: number, meta?: object) {
    super(take, meta);
    this.page = page;
    this.itemCount = count;
    this.pageCount = Math.ceil(count / take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
