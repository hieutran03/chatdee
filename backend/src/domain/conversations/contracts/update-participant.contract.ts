import { ConversationRoleEnum } from "src/shared/common/enums/conversation-role.enum";

export class UpdateParticipantContract{
  role: ConversationRoleEnum;
  constructor(role: ConversationRoleEnum){
    this.role = role;
  }
}