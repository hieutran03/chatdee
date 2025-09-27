import { UserInConversation } from "src/domain/conversations/entities/user-in-conversation.entity";

export const IUserInConversationRepositoryToken = 'IUserInConversationRepository';
export interface IUserInConversationRepository {
  findParticipant(userId: string, conversationId: string): Promise<UserInConversation>;
  findUserInConversations(conversationId: string): Promise<UserInConversation[]>;
  findAllConversationsOfUser(userId: string): Promise<UserInConversation[]>;
  addParticipant(conversationId: string, userId: string): Promise<void>;
  removeParticipant(conversationId: string, userId: string): Promise<void>;
  removeAllParticipants(conversationId: string): Promise<void>;
}