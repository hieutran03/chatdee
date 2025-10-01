import { ValidationPipe } from "@nestjs/common";
import { ValidationPipeException } from "../exceptions/bad-request/validation-pipe.exception";

export class WsValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        throw new ValidationPipeException(errors);
      },
    });
  }
}
