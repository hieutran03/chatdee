import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";
import { Result } from "./result";

export class SuccessResult<T> extends Result{
  private constructor(
    public readonly statusCode: StatusCodeEnum = StatusCodeEnum.OK,
    public readonly data: T,
    public readonly message?: string,
  ) {
    super(true, statusCode);
  }

  public static responseOk<T>(data: T) {
    return new SuccessResult<T>(
      StatusCodeEnum.OK, 
      data,
      'Data fetched successfully'
    );
  }

  public static responseCreated<T>(data: T) {
    return new SuccessResult<T>(
      StatusCodeEnum.CREATED, 
      data,
      'Resource created successfully'
    );
  }

  public static responseUpdated<T>(data?: T) {
    return new SuccessResult<T>(
      StatusCodeEnum.OK,
      data,
      'Data updated successfully'
    );
  }

  public static responseDeleted<T>() {
    return new SuccessResult<T>(
      StatusCodeEnum.OK,
      undefined,
      'Data deleted successfully'
    );
  }

  public static responseNoContent() {
    return new SuccessResult<void>(
      StatusCodeEnum.NO_CONTENT, 
      undefined,
      'No content'
    );
  }

  public static responseAccepted<T>(data: T) {
    return new SuccessResult<T>(
      StatusCodeEnum.ACCEPTED, 
      data,
      'Request accepted'
    );
  }
}