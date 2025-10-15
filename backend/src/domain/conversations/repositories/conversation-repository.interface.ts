import { UUID } from "crypto";
import { ConversationPaginationContract } from "src/domain/conversations/contracts/conversation-pagination.contract";
import { Conversation } from "src/domain/conversations/conversation";
import { Direction } from "src/shared/common/enums/direction.enum";
import { ConversationDetailContract } from "../contracts/conversation-detail.contract";
import { MemberContract } from "../contracts/member.contract";
import { TCursor } from "src/shared/common/types/cursor.type";

export const IConversationRepositoryToken = 'IConversationRepository';
export interface IConversationRepository {
  findWithCursorPagination(userId: UUID, limit: number, cursor: TCursor, direction?: Direction): Promise<ConversationPaginationContract>;
  save(conversation: Conversation): Promise<Conversation>;
  findById(id: UUID): Promise<Conversation>;
  findByIdDetails(id: UUID): Promise<ConversationDetailContract>;
  // findAllMember(conversationId: UUID): Promise<MemberContract[]>;
  findMembers(conversationId: UUID): Promise<MemberContract[]>;
  findTopMembers(conversationId: UUID, limit: number): Promise<MemberContract[]>;
  findDirectConversation(firstUserId: string, secondUserId: string): Promise<Conversation>;
  countMembers(conversationId: UUID): Promise<number>;
  findByUserId(userId: string): Promise<Conversation[]>;
  update(id: UUID,conversation: Conversation): Promise<void>;
  delete(id: UUID): Promise<void>;
}