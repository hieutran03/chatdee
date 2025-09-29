import { UserInConversation } from "src/domain/conversations/entities/user-in-conversation.entity";

export const IUserInConversationRepositoryToken = 'IUserInConversationRepository';
export interface IUserInConversationRepository {
  findParticipant(userId: string, conversationId: string): Promise<UserInConversation>;
  findUserInConversations(conversationId: string): Promise<UserInConversation[]>;
  findAllConversationsOfUser(userId: string): Promise<UserInConversation[]>;

}