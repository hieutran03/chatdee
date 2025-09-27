import {
  ErrorCode,
  StatusCodeEnum,
} from 'src/shared/common/enums/error-code.enum';
import { Result } from './result';

interface IErrorField {
  field: string;
  message: string;
}

export class ErrorResult extends Result{
  private constructor(
    public readonly message: string,
    public readonly statusCode: StatusCodeEnum,
    public readonly code: ErrorCode,
    public readonly errors?: string[],
    public readonly field?: IErrorField[],
    public readonly stack?: string,
  ) {
    super(false, statusCode, message);
    if (!message) {
      this.message = `Error occurred: ${code}`;
    }
  }

  static responseBussinessError(message: string, code: ErrorCode, errors?: string[], stack?: string) {
    return new ErrorResult(message, StatusCodeEnum.BAD_REQUEST, code, errors, undefined, stack);
  }

  static responseNotFoundError(message: string, code: ErrorCode, errors?: string[], stack?: string) {
    return new ErrorResult(message, StatusCodeEnum.NOT_FOUND, code, errors, undefined, stack);
  }

  static responseConflictError(message: string, code: ErrorCode, errors?: string[], stack?: string) {
    return new ErrorResult(message, StatusCodeEnum.CONFLICT, code, errors, undefined, stack);
  }

  static responseForbiddenError(message: string, code: ErrorCode, errors?: string[], stack?: string) {
    return new ErrorResult(message, StatusCodeEnum.FORBIDDEN, code, errors, undefined, stack);
  }

  static responseInfrastructureError(message: string, errorCode: ErrorCode, statusCode?: StatusCodeEnum, errors?: string[], stack?: string) {
    return new ErrorResult(message, statusCode || StatusCodeEnum.INTERNAL_SERVER_ERROR, errorCode, errors, undefined, stack);
  }

  static responseUnknownError(message: string, stack?: string) {
    return new ErrorResult(message, StatusCodeEnum.INTERNAL_SERVER_ERROR, ErrorCode.UNKNOWN, undefined, undefined, stack);
  }
}
