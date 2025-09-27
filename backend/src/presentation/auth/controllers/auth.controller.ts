import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { LoginInput } from "../../../application/auth/dtos/login.input";
import { LoginCommand } from "src/application/auth/commands/login.command";
import { GetProfileQuery } from "src/application/auth/queries/get-profile.query";
import { UserDecorator } from "src/shared/core/decorators/user.decorator";
import { ApiDecorator } from "src/shared/core/decorators/api.decorator";
import { AuthResponseSwagger, AuthOperation } from "../swagger/auth-response.swagger";
import { IUserToSign } from "src/application/auth/interfaces/user-to-sign.interface";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}


  @AuthResponseSwagger(AuthOperation.login)
  @ApiDecorator({ isPublic: true })
  @Post('login')
  async login(@Body() loginInput: LoginInput){
    const result = await this.commandBus.execute(new LoginCommand(loginInput));
    return result;
  }

  @ApiDecorator({ isPublic: false })
  @Get('profile')
  async getProfile(@UserDecorator() user: IUserToSign){
    const result = await this.queryBus.execute(new GetProfileQuery(user.email));
    return result;
  }
}