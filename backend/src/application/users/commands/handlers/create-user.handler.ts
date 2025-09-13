import { Transactional } from 'typeorm-transactional';
import { Result, SuccessResult } from 'src/shared/libs/result';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { responseErrorResult } from 'src/shared/core/utils/exception.util';
import { CreateUserCommand } from '../create-users.command';
import { UserService } from '../../services/user.service';
import { UserOutput } from 'src/application/users/dtos/user.output';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userService: UserService
  ) {}

  @Transactional()
  async execute({
    payload,
  }: CreateUserCommand): Promise<Result> {
    try {
      const output = await this.userService.createUser(payload);
      return SuccessResult.responseCreated<UserOutput>(output);
    } catch (error) {
      return responseErrorResult(error);
    }
  }
}
