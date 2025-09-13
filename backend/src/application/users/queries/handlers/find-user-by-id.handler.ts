import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindUserByIdQuery } from "../find-user-by-id.query";
import { SuccessResult } from "src/shared/libs/result";
import { UserService } from "../../services/user.service";

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery>{
  constructor(
    private readonly userService: UserService
  ) {}

  async execute({id}: FindUserByIdQuery) {
    const user = await this.userService.findUserById(id);
    return SuccessResult.responseOk(user)
  }
}
