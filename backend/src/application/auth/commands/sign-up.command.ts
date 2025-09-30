import { SignupInput } from "../dtos/sign-up.input";

export class SignUpCommand{
  constructor(
    public readonly input: SignupInput
  ){}
}