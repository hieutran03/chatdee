import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { BusinessException } from "./bussiness.exception";

export class AddToDirectConversationException extends BusinessException{
  constructor(conversationId: string, userId: string){
    super(`Cannot add user ${userId} to direct conversation ${conversationId}`, ErrorCode.CONVS_06);
  }
}