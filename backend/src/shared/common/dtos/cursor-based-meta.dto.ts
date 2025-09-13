import { ApiProperty } from "@nestjs/swagger";
import { PageMetaDto } from "./page-meta.dto";

export class CursorBasedMetaDto extends PageMetaDto{
  @ApiProperty()
  nextCursor: Date;
  
  @ApiProperty()
  prevCursor: Date;

  constructor(take: number, nextcursor?: Date, prevcursor?: Date, meta?: object) {
    super(take, meta);
    this.nextCursor = nextcursor;
    this.prevCursor = prevcursor;
  }
}