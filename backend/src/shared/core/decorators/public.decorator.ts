import { SetMetadata } from '@nestjs/common';
import { ApiMetadata } from 'src/shared/common/constants/api-metadata.constants';

export function Public() {
  return SetMetadata(ApiMetadata.IS_PUBLIC, true);
}