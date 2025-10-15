import { Conversation } from "../conversation";
import { MemberContract } from "./member.contract";

export class ConversationDetailContract extends Conversation{
  constructor(conversation: Conversation,owner: MemberContract){
    super(conversation.id, conversation.title.value, conversation.type, conversation.theme, conversation.avatar, conversation.userInConversations, conversation.owner);

    // this.members = members;
    this.ownerMember = owner;
  }
  ownerMember: MemberContract;

  // members: MemberContract[];
}