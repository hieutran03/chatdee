import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { ConflictException } from "./conflict.exception";

export class UserAlreadyInConversationException extends ConflictException{
  constructor(userId: string){
    super(`User already in conversation: ${userId}`, ErrorCode.CONVS_03);
  }
}