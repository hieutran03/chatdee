import { UpdateUserCommand } from "../update-user.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { responseErrorResult } from "src/shared/core/utils/exception.util";
import { SuccessResult } from "src/shared/libs/result";
import { Transactional } from "typeorm-transactional";
import { UserService } from "../../services/user.service";

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand>{
  constructor(
    private readonly userService: UserService,
  ){}

  async execute({ payload, userId }: UpdateUserCommand) {
    try{
      await this.userService.updateUser(userId, payload);
      return SuccessResult.responseUpdated();
    }catch(error){
      return responseErrorResult(error)
    }
  }

}