import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from './public.decorator';
import { applyDecorators } from '@nestjs/common/decorators/core/apply-decorators';
import { RoleEnum } from 'src/domain/users/enums/role.enum';

interface ApiDecoratorOptions {
  isPublic: boolean;
  roles?: RoleEnum[];
}

export function ApiDecorator({ isPublic }: ApiDecoratorOptions) {
  const decorators = [];

  if (!isPublic) {
    decorators.push(ApiBearerAuth('JWT-auth'));
  }else{
    decorators.push(Public());
  }


  return applyDecorators(...decorators);
}
