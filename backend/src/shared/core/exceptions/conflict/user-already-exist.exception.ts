import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { ConflictException } from "./conflict.exception";

export class UserAlreadyExistException extends ConflictException{
  constructor(email: string){
    super(`User already exists: ${email}`, ErrorCode.USER_02);
  }
}