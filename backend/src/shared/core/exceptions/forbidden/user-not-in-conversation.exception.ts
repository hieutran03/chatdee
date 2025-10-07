import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { ForbiddenException } from "./forbidden.exception";

export class UserNotInConversationException extends ForbiddenException{
  constructor(conversationId: string){
    super(`User is not a member of conversation with id ${conversationId}`, ErrorCode.CONVS_09);
  }
}