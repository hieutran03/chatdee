import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { BadRequestException } from "./bad-request.exception";

export class AddInvalidUserToConversationException extends BadRequestException {
  constructor(errors: string[]) {
    super('Some users do not exist', ErrorCode.CONVS_11, errors);
  }
}