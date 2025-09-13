import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindAllUserQuery } from "../find-all-user.query";
import { UserService } from "../../services/user.service";
import { SuccessResult } from "src/shared/libs/result";

@QueryHandler(FindAllUserQuery)
export class FindAllUserHandler implements IQueryHandler<FindAllUserQuery> {
  constructor(
    private readonly userService: UserService
  ) {}

  async execute({ query }: FindAllUserQuery) {
    const output = await this.userService.findAllUsers(query);
    return SuccessResult.responseOk(output)
  }
}