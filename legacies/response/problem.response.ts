import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";
import { ErrorResult } from "../result";
import { BaseResponse } from "./base.response";

export class Problem extends BaseResponse {
  constructor(
    public readonly errors: ErrorResult[],
    statusCode: StatusCodeEnum = StatusCodeEnum.BAD_REQUEST,
    traceId?: string,
  ) {
    super(false, statusCode, traceId);
  }
}