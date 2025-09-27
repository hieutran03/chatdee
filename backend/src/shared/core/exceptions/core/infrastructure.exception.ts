import { ErrorCode, StatusCodeEnum } from "src/shared/common/enums/error-code.enum";

export class InfrastructureException extends Error{
  message: string;
  type: string;
  statusCode?: StatusCodeEnum;
  errorCode?: ErrorCode;
  constructor(message: string, statusCode: StatusCodeEnum = StatusCodeEnum.SERVICE_UNAVAILABLE, errorCode?: ErrorCode){
    super()
    this.message = message;
    this.type = 'InfrastructureException';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}
