import { UUID } from "crypto";
import { ForbiddenException } from "./forbidden.exception";
import { ErrorCode } from "src/shared/common/enums/error-code.enum";

export class ModifyOthersMessageException extends ForbiddenException{
  constructor(
    public readonly userId: UUID,
    public readonly messageId: UUID,
  ){
    super(`User ${userId} is not allowed to modify message ${messageId}`, ErrorCode.MSG_04);
  }
}