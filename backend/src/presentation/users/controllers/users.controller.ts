import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateUserInput } from "../../../application/users/dtos/create-user.input";
import { CreateUserCommand } from "../../../application/users/commands/create-users.command";
import { UpdateUserInput } from "../../../application/users/dtos/update-user.input";
import { UUID } from "crypto";
import { UUIDValidationPipe } from "src/shared/core/pipes/uuid-validation.pipe";
import { UpdateUserCommand } from "src/application/users/commands/update-user.command";
import { ApiDecorator } from "src/shared/core/decorators/api.decorator";
import { RoleEnum } from "src/domain/users/enums/role.enum";
import { Roles } from "src/shared/core/decorators/role.decorator";
import { FindAllUsersInput } from "../../../application/users/dtos/find-all-users.input";
import { FindAllUserQuery } from "src/application/users/queries/find-all-user.query";
import { FindUserByIdQuery } from "src/application/users/queries/find-user-by-id.query";
import { DeleteUserCommand } from "src/application/users/commands/delete-user.command";

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @ApiDecorator({ isPublic: true })
  @Get()
  async findAllUsers(@Query() findAllUsersInput: FindAllUsersInput){
    const result = await this.queryBus.execute(new FindAllUserQuery(findAllUsersInput));
    return result;
  }

  @ApiDecorator({ isPublic: true })
  @Get(':id')
  findUserById(@Param('id', UUIDValidationPipe) id: UUID){
    return this.queryBus.execute(new FindUserByIdQuery(id));
  }

  @Roles([RoleEnum.ADMIN])
  @ApiDecorator({ isPublic: false })
  @Post()
  async createUser(@Body() createUserInput: CreateUserInput){
    const result = await this.commandBus.execute(new CreateUserCommand(createUserInput));
    return result;
  }

  @Roles([RoleEnum.ADMIN])
  @ApiDecorator({ isPublic: false })
  @Patch(':id')
  async updateUser(@Param('id', UUIDValidationPipe) id: UUID, @Body() updateUserInput: UpdateUserInput){
    const result = await this.commandBus.execute(new UpdateUserCommand(id, updateUserInput));
    return result;
  }

  @Roles([RoleEnum.ADMIN])
  @ApiDecorator({ isPublic: false })
  @Delete(':id')
  async deleteUser(@Param('id', UUIDValidationPipe) id: UUID){
    const result = await this.commandBus.execute(new DeleteUserCommand(id));
    return result;
  }
}