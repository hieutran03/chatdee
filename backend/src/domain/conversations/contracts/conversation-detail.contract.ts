import { User } from "src/domain/users/users";
import { Conversation } from "../conversation";

export class ConversationDetailContract extends Conversation{
  constructor(conversation: Conversation, createdAt: Date, updatedAt: Date, members: User[], createdByUser: User){
    super(conversation.id, conversation.title.value, conversation.type, conversation.theme, conversation.avatar, conversation.userInConversations, conversation.createdBy);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.members = members;
    this.createdByUser = createdByUser;
  }
  createdByUser: User;
  createdAt: Date;
  updatedAt: Date;
  members: User[];
}