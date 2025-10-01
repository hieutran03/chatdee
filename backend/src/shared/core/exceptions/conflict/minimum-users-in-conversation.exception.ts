import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { ConflictException } from "@nestjs/common";

export class MinimumUsersInConversationException extends ConflictException{
  constructor(){
    super(`Minimum users not met for conversation`, ErrorCode.CONVS_02);
  }
}