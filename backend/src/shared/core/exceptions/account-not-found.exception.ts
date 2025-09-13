import { HttpException } from "@nestjs/common";
import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";

export class AccountNotFoundException extends HttpException{
  constructor(email: string){
    super(`Account not found: ${email}`, StatusCodeEnum.UNAUTHORIZED);
  }
}