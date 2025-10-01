import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { CoreException } from "../core/core.exception";

export class ForbiddenException extends CoreException{
  constructor(message: string, errorCode: ErrorCode){
    super(message, errorCode);
  }
}