import { HttpException } from "@nestjs/common";
import { UUID } from "crypto";
import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";

export class ConversationNotFoundException extends HttpException{
  constructor(firstUserId: UUID, secondUserId: UUID){
    super(`A direct conversation between user ${firstUserId} and user ${secondUserId} not found`, StatusCodeEnum.NOT_FOUND);
  }
}