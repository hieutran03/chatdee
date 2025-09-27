import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { NotFoundException } from "./not-found.exception";

export class AccountNotFoundException extends NotFoundException{
  constructor(email: string){
    super(`Account not found: ${email}`, ErrorCode.USER_01);
  }
}