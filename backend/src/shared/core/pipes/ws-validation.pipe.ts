import { ValidationPipe } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

export class WsValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        // Format lỗi cho WebSocket
        const formattedErrors = errors.map(error => ({
          field: error.property,
          constraints: error.constraints
        }));
        throw new WsException({
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          errors: formattedErrors
        });
      },
    });
  }
}
