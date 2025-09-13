import { HttpException } from "@nestjs/common";
import { UUID } from "crypto";
import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";

export class UserNotFoundException extends HttpException{
  constructor(userId: UUID){
    super(`User with ID ${userId} not found`, StatusCodeEnum.NOT_FOUND);
  }
}