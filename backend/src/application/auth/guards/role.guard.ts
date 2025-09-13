
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleEnum } from 'src/domain/users/enums/role.enum';
import { ApiMetadata } from 'src/shared/common/constants/api-metadata.constants';
import { RestrictedResourceException } from 'src/shared/core/exceptions/restricted-resource.exception';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ApiMetadata.ROLES,
      [context.getHandler(), context.getClass()],
    );

    if (!roles || roles.length === 0) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const isValidRole = roles.includes(user.role);
    if (!isValidRole)
      throw new RestrictedResourceException();
    return true;
  }
}