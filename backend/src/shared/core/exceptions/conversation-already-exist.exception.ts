import { HttpException, HttpStatus } from "@nestjs/common";
import { UUID } from "crypto";

export class ConversationAlreadyExistException extends HttpException{
  constructor(firstUserId: UUID, secondUserId: UUID, conversationId?: UUID){
    super(`This direct conversation already exists between ${firstUserId} and ${secondUserId}${conversationId ? ` (ID: ${conversationId})` : ''}`, HttpStatus.CONFLICT);
  }
}