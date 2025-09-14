import { UserInConversation } from "src/domain/conversations/entities/user-in-conversation.entity";

export const IUserInConversationRepositoryToken = 'IUserInConversationRepository';
export interface IUserInConversationRepository {
  findUserInConversations(conversationId: string): Promise<UserInConversation[]>;
  findAllConversationsOfUser(userId: string): Promise<UserInConversation[]>;
}