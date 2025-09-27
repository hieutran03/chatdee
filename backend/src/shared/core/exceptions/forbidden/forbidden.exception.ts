import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { DomainException } from "../core/domain.exception";

export class ForbiddenException extends DomainException{
  constructor(message: string, errorCode: ErrorCode){
    super(message, errorCode);
  }
}