import { TCursor } from "src/shared/common/types/cursor.type";
import { Message } from "../message";

export type MessagePaginationContract = {
  messages: Message[];
  limit: number;
  nextCursor?: TCursor;
  previousCursor?: TCursor;
}