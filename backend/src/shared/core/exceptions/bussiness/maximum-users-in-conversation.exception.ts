import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { BusinessException } from "./bussiness.exception";

export class MaximumUserInConversationException extends BusinessException{
  constructor(){
    super(`Maximum user limit reached: 50`, ErrorCode.CONVS_07);
  }
}
