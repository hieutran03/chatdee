import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ApiMetadata } from 'src/shared/common/constants/api-metadata.constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      ApiMetadata.IS_PUBLIC,
      [context.getHandler(), context.getClass()],
    );
    
    if (isPublic) return true;

    return super.canActivate(context);
  }
}