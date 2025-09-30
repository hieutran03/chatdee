import { User } from "src/domain/users/users";
import { Conversation } from "../conversation";
import { MemberContract } from "./member.contract";

export class ConversationDetailContract extends Conversation{
  constructor(conversation: Conversation, createdAt: Date, updatedAt: Date, members: MemberContract[], ownerUser: User){
    super(conversation.id, conversation.title.value, conversation.type, conversation.theme, conversation.avatar, conversation.userInConversations, conversation.owner);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.members = members;
    this.ownerUser = ownerUser;
  }
  ownerUser: User;
  createdAt: Date;
  updatedAt: Date;
  members: MemberContract[];
}