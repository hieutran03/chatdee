import { ErrorCode } from "src/shared/common/enums/error-code.enum";
import { BadRequestException } from "./bad-request.exception";
import { ValidationError } from "class-validator";

export class ValidationPipeException extends BadRequestException {
  constructor(validationErrors: ValidationError[]) {
    const errors = {};
    validationErrors.forEach((error) => {
      errors[error.property] = Object.values(error.constraints).join(', ');
    });
    super(
      'Validation failed',
      ErrorCode.SYS_01,
      errors
    );
  }
}

