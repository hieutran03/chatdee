import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindUserByIdQuery } from "../find-user-by-id.query";
import { SuccessResult } from "src/shared/libs/result";
import { UserService } from "../../services/user.service";
import { responseErrorResult } from "src/shared/core/utils/exception.util";
import { UserNotFoundException } from "src/shared/core/exceptions/not-found/user-not-found-exception";

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery>{
  constructor(
    private readonly userService: UserService
  ) {}

  async execute({id}: FindUserByIdQuery) {
    const user = await this.userService.findUserById(id);
    if(!user) 
      return responseErrorResult(new UserNotFoundException(id))
    return SuccessResult.responseOk(user)
  }
}
