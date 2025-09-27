import { ErrorCode, StatusCodeEnum } from "src/shared/common/enums/error-code.enum";
import { InfrastructureException } from "../core/infrastructure.exception";

export class InvalidCredentialsException extends InfrastructureException{
  constructor(){
    super('Invalid credentials', StatusCodeEnum.UNAUTHORIZED, ErrorCode.AUTH_01);
  }
}