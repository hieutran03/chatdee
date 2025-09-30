import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SignUpCommand } from "../sign-up.command";
import { AuthService } from "../../services/auth.service";
import { SuccessResult } from "src/shared/libs/result";
import { responseErrorResult } from "src/shared/core/utils/exception.util";

@CommandHandler(SignUpCommand)
export class SignupHandler implements ICommandHandler<SignUpCommand>{
  constructor(
    private readonly authService: AuthService
  ){}
  async execute({input}: SignUpCommand) {
    try {
      const result = await this.authService.register(input);
      return SuccessResult.responseCreated(result);
    } catch (error) {
      return responseErrorResult(error);
    }
  }
}