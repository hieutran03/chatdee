import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { ConflictException } from "./conflict.exception";

export class DirectConversationAlreadyExistsException extends ConflictException{
  constructor(firstUserId: string, secondUserId: string){
    super(`Direct conversation already exists for users: ${firstUserId}, ${secondUserId}`, ErrorCode.CONVS_04);
  }
}