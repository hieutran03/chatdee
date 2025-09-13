import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateConversationCommand } from "src/application/conversations/commands/create-conversation.command";
import { CreateConversationInput } from "src/application/conversations/dtos/create-conversation.input";
import { User } from "src/domain/users/users";
import { ApiDecorator } from "src/shared/core/decorators/api.decorator";
import { UserDecorator } from "src/shared/core/decorators/user.decorator";

 @Controller('conversations')
 export class ConversationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}
  
  @ApiDecorator({isPublic: false})
  @Post()
  async createConversation(@UserDecorator() user: User, @Body() createConversationInput: CreateConversationInput) {
    return await this.commandBus.execute(new CreateConversationCommand(user.id, createConversationInput));
  }
}