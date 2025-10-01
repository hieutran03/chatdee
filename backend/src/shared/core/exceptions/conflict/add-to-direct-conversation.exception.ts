import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { ConflictException } from "@nestjs/common";

export class AddToDirectConversationException extends ConflictException{
  constructor(conversationId: string, userId: string){
    super(`Cannot add user ${userId} to direct conversation ${conversationId}`, ErrorCode.CONVS_06);
  }
}