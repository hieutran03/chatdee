import { ErrorCode } from "src/shared/common/enums/error-code.enum";

export class CoreException extends Error{
  message: string;
  errorCode: ErrorCode;
  errors?: any;
  constructor(message: string, errorCode: ErrorCode, errors?: any){
    super();
    this.message = message;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}


