import { UUID } from "crypto";
import { Message } from "../message";
import { TCursor } from "src/shared/common/types/cursor.type";
import { Direction } from "src/shared/common/enums/direction.enum";
import { MessagePaginationContract } from "../contracts/message-pagination.contract";

export const IMessageRepositoryToken = 'IMessageRepository';
export interface IMessageRepository{
  findWithCursorPagination(conversationId: UUID, limit: number, cursor: TCursor, direction?: Direction): Promise<MessagePaginationContract>;
  save(message: Message): Promise<void>;
  findById(id: UUID): Promise<Message>;
}