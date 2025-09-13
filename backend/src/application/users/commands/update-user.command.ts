import { UUID } from "crypto";
import { UpdateUserInput } from "src/application/users/dtos/update-user.input";

export class UpdateUserCommand{
  constructor(
    public readonly userId: UUID,
    public readonly payload: UpdateUserInput
  ){}
}