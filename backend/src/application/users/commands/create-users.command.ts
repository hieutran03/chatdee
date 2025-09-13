import { CreateUserInput } from "../dtos/create-user.input";

export class CreateUserCommand{
  constructor(public readonly payload: CreateUserInput) {}
}