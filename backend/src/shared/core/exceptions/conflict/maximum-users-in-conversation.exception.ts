import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { ConflictException } from "./conflict.exception";

export class MaximumUserInConversationException extends ConflictException{
  constructor(){
    super(`Maximum user limit reached: 50`, ErrorCode.CONVS_07);
  }
}
