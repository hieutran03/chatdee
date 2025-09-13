import { HttpException } from "@nestjs/common";
import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";

export class ValidationBusinessException extends HttpException{
  constructor(public readonly errors: string[]) {
    super('Business validation failed', StatusCodeEnum.BAD_REQUEST);
  }
}