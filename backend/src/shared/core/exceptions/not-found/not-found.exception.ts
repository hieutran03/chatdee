import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { DomainException } from "../core/domain.exception";

export class NotFoundException extends DomainException {
  message: string;
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode);
    this.message = message;
  }
}