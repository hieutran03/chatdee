import { MemberContract } from "src/domain/conversations/contracts/member.contract";
import { ConversationRoleEnum } from "src/shared/common/enums/conversation-role.enum";
import { UUID } from "crypto";
export class MemberOutput {
  id: UUID;
  conversationRole: ConversationRoleEnum;
  name: string;
  avatar: string;
  email: string;
  bornYear: number;
  constructor(member: MemberContract) {
    this.id = member.userId;
    this.conversationRole = member.role;
    this.name = member.name;
    this.bornYear = member.bornYear;
    this.email = member.email;
    this.avatar = member.avatar;
  }
}