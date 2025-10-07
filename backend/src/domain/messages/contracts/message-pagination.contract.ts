import { TCursor } from "src/shared/common/types/cursor.type";
import { MessageDetailContract } from "./message-detail.contract";

export type MessagePaginationContract = {
  messages: MessageDetailContract[];
  limit: number;
  nextCursor?: TCursor;
  previousCursor?: TCursor;
}