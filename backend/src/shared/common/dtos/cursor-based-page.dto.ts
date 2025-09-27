import { ApiProperty } from "@nestjs/swagger";
import { TCursor } from "../types/cursor.type";

export class CursorBasedMetaDto {
    
  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  nextCursor: TCursor;

  @ApiProperty()
  prevCursor: TCursor;

  constructor(take: number, nextcursor?: TCursor, prevcursor?: TCursor) {
    this.take = take;
    this.nextCursor = nextcursor;
    this.prevCursor = prevcursor;
  }
}

export class CursorBasedPageDto<T> {
  @ApiProperty({ isArray: true })
  items: T[];
  @ApiProperty({ type: () => CursorBasedMetaDto })
  meta: CursorBasedMetaDto;
  constructor(items: T[], take: number, nextcursor?: TCursor, prevcursor?: TCursor) {
    this.items = items;
    this.meta = new CursorBasedMetaDto(take, nextcursor, prevcursor);
  }
}