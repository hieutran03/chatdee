import { TCursor } from "./cursor.type";

export type TCursorPaginationResult<T> = {
  data: T[];
  limit: number;
  nextCursor?: TCursor;
  previousCursor?: TCursor;
}