import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { BusinessException } from "./bussiness.exception";

export class MinimumUsersInConversationException extends BusinessException{
  constructor(){
    super(`Minimum users not met for conversation`, ErrorCode.CONVS_02);
  }
}