import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { ConflictException } from "./conflict.exception";

export class MessageNotInConversationException extends ConflictException{
  constructor(messageId: string, conversationId: string){
    super(`Message with id ${messageId} is not in conversation with id ${conversationId}`, ErrorCode.MSG_03);
  }
}