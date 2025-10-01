import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { CoreException } from "../core/core.exception";

export class NotFoundException extends CoreException {
  message: string;
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, errors);
  }
}