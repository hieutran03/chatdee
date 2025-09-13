import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { UUID } from 'crypto';

@Injectable()
export class UUIDValidationPipe implements PipeTransform<string, UUID> {
  transform(value: string, metadata: ArgumentMetadata): UUID {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new BadRequestException(`Invalid UUID format: ${value}`);
    }
    return value as UUID;
  }
}