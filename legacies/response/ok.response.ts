import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";
import { BaseResponse } from "./base.response";

export class OK extends BaseResponse {
  constructor(
    public readonly data?: any,
    statusCode: StatusCodeEnum = StatusCodeEnum.OK,
    traceId?: string,
  ) {
    super(true, statusCode, traceId);
  }
}