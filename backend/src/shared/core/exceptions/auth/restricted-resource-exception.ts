import { ErrorCode, StatusCodeEnum } from "src/shared/common/enums/error-code.enum";
import { InfrastructureException } from "../core/infrastructure.exception";

export class RestrictedResourceException extends InfrastructureException{
  constructor(){
    super('Resource is not available to access', StatusCodeEnum.FORBIDDEN, ErrorCode.AUTH_02);
  }
}