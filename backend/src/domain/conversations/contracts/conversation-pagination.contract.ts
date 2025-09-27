import { TCursor } from "src/shared/common/types/cursor.type";
import { Conversation } from "../conversation";

export type ConversationPaginationContract = {
  conversations: Conversation[];
  limit: number;
  nextCursor?: TCursor;
  previousCursor?: TCursor;
}