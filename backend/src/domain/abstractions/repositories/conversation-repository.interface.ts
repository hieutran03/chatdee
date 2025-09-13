import { UUID } from "crypto";
import { Conversation } from "src/domain/conversations/conversation";

export const IConversationRepositoryToken = 'IConversationRepository';
export interface IConversationRepository {
  save(conversation: Conversation): Promise<Conversation>;
  findDirectConversation(firstUserId: string, secondUserId: string): Promise<Conversation>;
  // findById(id: string): Promise<Conversation>;
  findByUserId(userId: string): Promise<Conversation[]>;
  update(id: UUID,conversation: Conversation): Promise<void>;
}