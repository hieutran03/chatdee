import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { BadRequestException } from "./bad-request.exception";

export class InvalidNotificationPathFormatException extends BadRequestException {
  constructor(path: string) {
    super(`Invalid notification path format: ${path}`, ErrorCode.NOTI_02);
  }
}