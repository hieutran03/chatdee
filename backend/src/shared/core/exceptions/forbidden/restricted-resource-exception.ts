import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { ForbiddenException } from "@nestjs/common";

export class RestrictedResourceException extends ForbiddenException{
  constructor(){
    super('Resource is not available to access', ErrorCode.AUTH_02);
  }
}