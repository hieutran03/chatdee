import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { BadRequestException } from "./bad-request.exception";

export class UpdateNonTextMessageException extends BadRequestException{
  constructor(){
    super('Only text messages can be updated', ErrorCode.MSG_02);
  }
}