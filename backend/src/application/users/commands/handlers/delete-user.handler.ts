import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUserCommand } from "../delete-user.command";
import { UserService } from "../../services/user.service";
import { SuccessResult } from "src/shared/libs/result";
import { responseErrorResult } from "src/shared/core/utils/exception.util";

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand>{
  constructor(private readonly userService: UserService) {}
  async execute({id}: DeleteUserCommand){
    try {
      await this.userService.deleteUser(id);
      return SuccessResult.responseDeleted();
    } catch (error) {
      return responseErrorResult(error);
    }
  }
}