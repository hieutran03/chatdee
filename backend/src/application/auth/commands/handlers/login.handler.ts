import { CommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../login.command';
import { Transactional } from 'typeorm-transactional';
import { SuccessResult } from 'src/shared/libs/result';
import { LoginOutput } from 'src/application/auth/dtos/login.output';
import { responseErrorResult } from 'src/shared/core/utils/exception.util';
import { AuthService } from '../../services/auth.service';

@CommandHandler(LoginCommand)
export class LoginHandler {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Transactional()
  async execute({ payload }: LoginCommand){
    try {
      const output = await this.authService.getCredential(payload.email, payload.password);
      return SuccessResult.responseAccepted<LoginOutput>(output);
    } catch (exception) {
      return responseErrorResult(exception); 
    }
  }
}
