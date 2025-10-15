import { UUID } from "crypto";
import { IConversationRepository } from "src/domain/conversations/repositories/conversation-repository.interface";

export const IConversationRepositoryCacheToken = 'IConversationRepositoryCache';
export interface IConversationRepositoryCache extends IConversationRepository {
  addMember(userId: UUID, conversationId: UUID): Promise<void>;
  removeMember(userId: UUID, conversationId: UUID): Promise<void>;
  updateMember(userId: UUID, conversationId: UUID): Promise<void>;
}