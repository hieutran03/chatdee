import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { UnauthorizedException } from "./unauthorized.exception";

export class InvalidCredentialsException extends UnauthorizedException{
  constructor(){
    super('Invalid credentials', ErrorCode.AUTH_01);
  }
}