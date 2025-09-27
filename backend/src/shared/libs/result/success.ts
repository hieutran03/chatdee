import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";
import { Result } from "./result";
import { MessageSuccessEnum } from "src/shared/common/enums/message-success.enum";

export class SuccessResult<T> extends Result{
  private constructor(
    public readonly statusCode: StatusCodeEnum = StatusCodeEnum.OK,
    public readonly data: T,
    message?: string,
  ) {
    super(true, statusCode, message);
  }

  public static responseOk<T>(data?: T) {
    return new SuccessResult<T>(
      StatusCodeEnum.OK, 
      data,
      MessageSuccessEnum.OK
    );
  }

  public static responseCreated<T>(data?: T) {
    return new SuccessResult<T>(
      StatusCodeEnum.CREATED, 
      data,
      MessageSuccessEnum.CREATED
    );
  }

  public static responseUpdated<T>(data?: T) {
    return new SuccessResult<T>(
      StatusCodeEnum.OK,
      data,
      MessageSuccessEnum.UPDATED
    );
  }

  public static responseDeleted<T>(data?: T) {
    return new SuccessResult<T>(
      StatusCodeEnum.OK,
      data,
      MessageSuccessEnum.DELETED
    );
  }

  public static responseNoContent() {
    return new SuccessResult<void>(
      StatusCodeEnum.NO_CONTENT, 
      undefined,
      MessageSuccessEnum.NO_CONTENT
    );
  }

  public static responseAccepted<T>(data: T) {
    return new SuccessResult<T>(
      StatusCodeEnum.ACCEPTED, 
      data,
      MessageSuccessEnum.ACCEPTED
    );
  }
}