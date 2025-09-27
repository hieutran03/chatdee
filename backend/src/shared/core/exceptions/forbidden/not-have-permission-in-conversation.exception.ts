import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { ForbiddenException } from "./forbidden.exception";

export class NotHavePermissionInConversationException extends ForbiddenException{
  constructor(userId: string, conversationId: string){
    super(`User with id ${userId} does not have permission in conversation with id ${conversationId}`, ErrorCode.CONVS_10);
  }
}