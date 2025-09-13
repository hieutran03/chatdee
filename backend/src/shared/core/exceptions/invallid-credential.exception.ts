import { HttpException } from "@nestjs/common";
import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";

export class InvalidCredentialException extends HttpException{
  constructor(){
    super('Invalid credentials', StatusCodeEnum.UNAUTHORIZED);
  }
}