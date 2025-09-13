 
import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/domain/users/enums/role.enum';
import { ApiMetadata } from 'src/shared/common/constants/api-metadata.constants';

export function Roles(roles: RoleEnum[]) {
  return SetMetadata(ApiMetadata.ROLES, roles);
}