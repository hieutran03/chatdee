import { UUID } from "crypto";
import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { NotFoundException } from "./not-found.exception";

export class MessageNotFoundException extends NotFoundException{
  constructor(messageId: UUID){
    super(`Message not found ${messageId}`, ErrorCode.MSG_01);
  }
}