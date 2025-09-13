import { BadRequestException } from "@nestjs/common";
import { ValidationError } from "class-validator";

export class ValidationPipeException extends BadRequestException {
  constructor(validationErrors: ValidationError[]) {
    super({
      message: 'Validation failed',
      fields: validationErrors.map((error) => ({
        field: error.property,
        error: Object.values(error.constraints).join(', '),
      })),
    });
  }
}