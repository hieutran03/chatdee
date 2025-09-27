import { ErrorResult } from "src/shared/libs/result";
import { InfrastructureException } from "../exceptions/core/infrastructure.exception";
import { BusinessException } from "../exceptions/bussiness/bussiness.exception";
import { NotFoundException } from "../exceptions/not-found/not-found.exception";
import { ConflictException } from "../exceptions/conflict/conflict.exception";
import { ForbiddenException } from "../exceptions/forbidden/forbidden.exception";

export function responseErrorResult(exception: Error) {
  if(exception instanceof BusinessException){
    return ErrorResult.responseBussinessError(exception.message, exception.errorCode);
  }
  if(exception instanceof NotFoundException){
    return ErrorResult.responseNotFoundError(exception.message, exception.errorCode);
  }
  if(exception instanceof ConflictException){
    return ErrorResult.responseConflictError(exception.message, exception.errorCode);
  }
  if(exception instanceof ForbiddenException){
    return ErrorResult.responseForbiddenError(exception.message, exception.errorCode);
  }
  if(exception instanceof InfrastructureException){
    return ErrorResult.responseInfrastructureError(exception.message, exception.errorCode, exception.statusCode);
  }
  return ErrorResult.responseUnknownError(exception.message, exception.stack);
}