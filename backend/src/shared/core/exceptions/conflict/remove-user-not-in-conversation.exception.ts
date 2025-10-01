import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { ConflictException } from "./conflict.exception";

export class RemoveUserNotInConversationException extends ConflictException{
  constructor(removedUserId: string){
    super(`User ${removedUserId} is not in the conversation`, ErrorCode.CONVS_12);
  }
}