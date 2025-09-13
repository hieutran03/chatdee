import { HttpException } from "@nestjs/common";
import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";

export class MinimumUserInConversationConflictException extends HttpException{
  constructor(){
    super('A conversation must have at least 2 users', StatusCodeEnum.CONFLICT);
  }
}