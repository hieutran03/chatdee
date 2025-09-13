import { LoginInput } from "src/application/auth/dtos/login.input";

export class LoginCommand {
  constructor(
    public readonly payload: LoginInput
  ){}
}