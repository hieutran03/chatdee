import { ErrorResult } from "src/shared/libs/result";
import { NotFoundException } from "../exceptions/not-found/not-found.exception";
import { ConflictException } from "../exceptions/conflict/conflict.exception";
import { ForbiddenException } from "../exceptions/forbidden/forbidden.exception";
import { BadRequestException } from "../exceptions/bad-request/bad-request.exception";
import { UnauthorizedException } from "../exceptions/unauthorized/unauthorized.exception";

export function responseErrorResult(exception: Error) {
  if(process.env.NODE_ENV != 'development'){
    exception.stack = undefined;
  }
  if(exception instanceof BadRequestException){
    return ErrorResult.responseBadRequestError(exception.message, exception.errorCode, exception?.errors, exception?.stack);
  }
  if(exception instanceof NotFoundException){
    return ErrorResult.responseNotFoundError(exception.message, exception.errorCode, exception?.errors, exception?.stack);
  }
  if(exception instanceof ConflictException){
    return ErrorResult.responseConflictError(exception.message, exception.errorCode, exception?.errors, exception?.stack);
  }
  if(exception instanceof ForbiddenException){
    return ErrorResult.responseForbiddenError(exception.message, exception.errorCode, exception?.errors, exception?.stack);
  }
  if(exception instanceof UnauthorizedException){
    return ErrorResult.responseUnauthorizedError(exception.message, exception.errorCode, exception?.errors, exception?.stack);
  }
  return ErrorResult.responseUnknownError(exception.message, exception.stack);
}