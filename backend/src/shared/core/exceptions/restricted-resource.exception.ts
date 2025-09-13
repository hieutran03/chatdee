import { HttpException } from "@nestjs/common";
import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";

export class RestrictedResourceException extends HttpException {
  constructor() {
    super('Resource is not available to access', StatusCodeEnum.FORBIDDEN);
  }
}