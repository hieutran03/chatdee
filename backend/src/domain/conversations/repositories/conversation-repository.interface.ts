import { UUID } from "crypto";
import { ConversationExtraInfoContract } from "src/domain/conversations/contracts/conversation-extra-info.contract";
import { ConversationPaginationContract } from "src/domain/conversations/contracts/conversation-pagination.contract";
import { Conversation } from "src/domain/conversations/conversation";
import { Direction } from "src/shared/common/enums/direction.enum";
import { ConversationDetailContract } from "../contracts/conversation-detail.contract";

export const IConversationRepositoryToken = 'IConversationRepository';
export interface IConversationRepository {
  findWithCursorPagination(userId: UUID, limit: number, cursor: Date | string | number, direction: Direction): Promise<ConversationPaginationContract>;
  save(conversation: Conversation): Promise<Conversation>;
  findById(id: UUID): Promise<Conversation>;
  findByIdDetails(id: UUID): Promise<ConversationDetailContract>;
  findTopUsersAndTotal(conversationId: UUID, limit: number): Promise<ConversationExtraInfoContract>;
  findDirectConversation(firstUserId: string, secondUserId: string): Promise<Conversation>;
  countUsersOfConversation(): Promise<number>;
  // findById(id: string): Promise<Conversation>;
  findByUserId(userId: string): Promise<Conversation[]>;
  update(id: UUID,conversation: Conversation): Promise<void>;
  delete(id: UUID): Promise<void>;
}