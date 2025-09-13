import { HttpException } from "@nestjs/common";
import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";

export class UserAlreadyExistException extends HttpException{
  constructor(email: string){
    super('User already exists: ' + email, StatusCodeEnum.CONFLICT);
  }
}