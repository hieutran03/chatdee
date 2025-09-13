import { UserInConversation } from "src/domain/conversations/entities/user-in-conversation.entity";

export const IUserInConversationRepositoryToken = 'IUserInConversationRepository';
export interface IUserInConversationRepository {
  save(userInConversation: UserInConversation): Promise<UserInConversation>;
  // findById(id: string): Promise<UserInConversation>;
  // findAllByConversationId(conversationId: string): Promise<UserInConversation[]>;
  // update(userInConversation: UserInConversation): Promise<UserInConversation>;
  // delete(id: string): Promise<void>;
}