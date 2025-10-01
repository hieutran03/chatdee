import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { CoreException } from "../core/core.exception";

export class BadRequestException extends CoreException{
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, errors);
  }
}
