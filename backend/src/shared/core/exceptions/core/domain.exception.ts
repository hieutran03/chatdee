import { ErrorCode } from "src/shared/common/enums/error-code.enum";

export class DomainException extends Error{
  type: string;
  message: string;
  errorCode: ErrorCode;
  constructor(message: string, errorCode: ErrorCode, errors?: any[]){
    super();
    this.type = 'DomainException';
    this.message = message;
    this.errorCode = errorCode;
  }
}


