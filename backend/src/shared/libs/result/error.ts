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
    public readonly statusCode: StatusCodeEnum,
    public readonly code: ErrorCode,
    public readonly message?: string,
    public readonly field?: IErrorField[],
    public readonly errors?: string[],
    public readonly stack?: string,
  ) {
    super(false, statusCode);
    if (!message) {
      this.message = `Error occurred: ${code}`;
    }
  }

  public static responseAccountNotFound(message?: string, stack?: string) {
    return new ErrorResult(
      StatusCodeEnum.UNAUTHORIZED,
      ErrorCode.ACCOUNT_NOT_FOUND,
      message || 'Account not found',
      undefined,
      undefined,
      stack,
    );
  }

  public static responseInvalidCredentials(stack?: string) {
    return new ErrorResult(
      StatusCodeEnum.UNAUTHORIZED,
      ErrorCode.INVALID_CREDENTIALS,
      'Invalid email or password',
      undefined,
      undefined,
      stack,
    );
  }

  public static responseUnknownError(message?: string, stack?: string) {
    return new ErrorResult(
      StatusCodeEnum.INTERNAL_SERVER_ERROR,
      ErrorCode.UNKNOWN_ERROR,
      message || 'An unknown error occurred',
      undefined,
      undefined,
      stack,
    );
  }

  public static responseUserAlreadyExists(email: string, stack?: string) {
    return new ErrorResult(
      StatusCodeEnum.CONFLICT,
      ErrorCode.USER_ALREADY_EXISTS,
      `User with email ${email} already exists`,
      undefined,
      undefined,
      stack,
    );
  }

  public static responseUserNotFound(userId: string, stack?: string) {
    return new ErrorResult(
      StatusCodeEnum.NOT_FOUND,
      ErrorCode.USER_NOT_FOUND,
      `User with ID ${userId} not found`,
      undefined,
      undefined,
      stack,
    );
  }

  public static responseValidationError(
    fieldErrors: IErrorField[],
    message?: string,
    stack?: string,
  ) {
    return new ErrorResult(
      StatusCodeEnum.BAD_REQUEST,
      ErrorCode.VALIDATION_ERROR,
      message || 'Validation error occurred',
      fieldErrors,
      undefined,
      stack,
    );
  }

  public static responseRestrictedAccess(message?: string, stack?: string) {
    return new ErrorResult(
      StatusCodeEnum.FORBIDDEN,
      ErrorCode.RESTRICTED_ACCESS,
      message || 'You do not have permission to access this resource',
      undefined,
      undefined,
      stack,
    );
  }

  public static responseConversationAlreadyExists(message?: string, stack?: string) {
    return new ErrorResult(
      StatusCodeEnum.CONFLICT,
      ErrorCode.CONVERSATION_ALREADY_EXISTS,
      message || 'A direct conversation between these users already exists',
      undefined,
      undefined,
      stack,
    );
  }

  public static responseConversationNotFound(conversationId: string, stack?: string) {
    return new ErrorResult(
      StatusCodeEnum.NOT_FOUND,
      ErrorCode.CONVERSATION_NOT_FOUND,
      `Conversation with ID ${conversationId} not found`,
      undefined,
      undefined,
      stack,
    );
  }

  public static responseMinimumUsersNotMet(requiredCount: number = 2, stack?: string) {
    return new ErrorResult(
      StatusCodeEnum.BAD_REQUEST,
      ErrorCode.MINIMUM_USERS_NOT_MET,
      `A minimum of ${requiredCount} users is required to create a group conversation`,
      undefined,
      undefined,
      stack,
    );
  }

  public static responseBusinessValidationError(
    errors: string[],
    message?: string,
    stack?: string,
  ) {
    return new ErrorResult(
      StatusCodeEnum.BAD_REQUEST,
      ErrorCode.VALIDATION_ERROR,
      message || 'Business validation error occurred',
      undefined,
      errors,
      stack,
    );
  }
}
