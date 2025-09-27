import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { NotFoundException } from "./not-found.exception";

export class UserNotFoundException extends NotFoundException{
  constructor(userId: string){
    super(`User not found: ${userId}`, ErrorCode.USER_03);
  }
}