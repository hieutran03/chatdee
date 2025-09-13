import { FindAllUsersInput } from "src/application/users/dtos/find-all-users.input";

export class FindAllUserQuery{
  constructor(
    public readonly query: FindAllUsersInput
  ){} 
}