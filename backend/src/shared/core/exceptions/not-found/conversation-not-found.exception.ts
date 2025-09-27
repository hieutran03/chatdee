import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { NotFoundException } from "./not-found.exception";

export class ConversationNotFoundException extends NotFoundException{
  constructor(conversationId: string){
    super(`Conversation not found: ${conversationId}`, ErrorCode.CONVS_01);
  }
}