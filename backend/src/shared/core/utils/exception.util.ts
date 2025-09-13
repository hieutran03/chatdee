import { ErrorResult } from 'src/shared/libs/result';
import { AccountNotFoundException } from '../exceptions/account-not-found.exception';
import { UserAlreadyExistException } from '../exceptions/user-already-exists.exception';
import { InvalidCredentialException } from '../exceptions/invallid-credential.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { RestrictedResourceException } from '../exceptions/restricted-resource.exception';
import { ValidationBusinessException } from '../exceptions/validation-business.exception';
import { ConversationAlreadyExistException } from '../exceptions/conversation-already-exist.exception';
import { ConversationNotFoundException } from '../exceptions/conversation-not-found.exception';
import { MinimumUserInConversationConflictException } from '../exceptions/minimum-user-in-conversation-conflict.exception';

export function responseErrorResult(exception: Error) {
  if (exception instanceof AccountNotFoundException) {
    return ErrorResult.responseAccountNotFound(exception.message, exception.stack);
  }
  if (exception instanceof InvalidCredentialException) {
    return ErrorResult.responseInvalidCredentials(exception.stack);
  }
  if (exception instanceof UserAlreadyExistException) {
    return ErrorResult.responseUserAlreadyExists(exception.message, exception.stack);
  }
  if(exception instanceof UserNotFoundException){
    return ErrorResult.responseUserNotFound(exception.message, exception.stack);
  }
  if(exception instanceof RestrictedResourceException){
    return ErrorResult.responseRestrictedAccess(exception.message, exception.stack);
  }
  if(exception instanceof ValidationBusinessException) {
    return ErrorResult.responseBusinessValidationError(exception.errors, exception.message, exception.stack);
  }
  if (exception instanceof ConversationAlreadyExistException){
    return ErrorResult.responseConversationAlreadyExists(exception.message, exception.stack);
  }
  if(exception instanceof ConversationNotFoundException){
    return ErrorResult.responseConversationNotFound(exception.message, exception.stack);
  }
  if(exception instanceof MinimumUserInConversationConflictException){
    return ErrorResult.responseMinimumUsersNotMet(2, exception.stack);
  }

  return ErrorResult.responseUnknownError(exception.message, exception.stack);
}