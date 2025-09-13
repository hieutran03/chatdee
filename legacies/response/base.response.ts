import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";

export class BaseResponse {
  constructor(
    public success: boolean,
    public statusCode: StatusCodeEnum = StatusCodeEnum.OK, // default
    public traceId?: string,
  ) {}
}