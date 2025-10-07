import { ConversationRoleEnum } from "src/domain/conversations/enums/conversation-role.enum";

export class UpdateMemberContract{
  role: ConversationRoleEnum;
  constructor(role: ConversationRoleEnum){
    this.role = role;
  }
}