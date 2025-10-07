import { MemberContract } from "src/domain/conversations/contracts/member.contract";
import { ConversationRoleEnum } from "src/domain/conversations/enums/conversation-role.enum";
import { UUID } from "crypto";
export class MemberOutput {
  id: UUID;
  conversationRole: ConversationRoleEnum;
  name: string;
  avatar: string;
  constructor(member: MemberContract) {
    this.id = member.userId;
    this.conversationRole = member.role;
    this.name = member.name;
    this.avatar = member.avatar;
  }
}