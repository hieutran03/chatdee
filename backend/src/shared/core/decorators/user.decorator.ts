import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request?.user) {
      throw new InternalServerErrorException(
        'User decorator can only be used after authentication middleware',
      );
    }
    return request.user;
  },
);