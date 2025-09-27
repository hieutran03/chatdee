import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { NotFoundException } from "./not-found.exception";

export class DirectConversationNotFoundException extends NotFoundException{
  constructor(firstUserId: string, secondUserId: string){
    super(`Direct conversation not found between: ${firstUserId}, ${secondUserId}`, ErrorCode.CONVS_05);
  }
}