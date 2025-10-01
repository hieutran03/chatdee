import { Body, Controller, Delete, Get, Param, Patch, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { UUID } from "crypto";
import { IUserToSign } from "src/application/auth/interfaces/user-to-sign.interface";
import { UpdateMessageCommand } from "src/application/messages/commands/update-message.command";
import { FindMessagesInput } from "src/application/messages/dtos/find-messages.input";
import { UpdateMessagesInput } from "src/application/messages/dtos/update-messages.input";
import { FindMessagesQuery } from "src/application/messages/queries/find-messages.query";
import { ApiDecorator } from "src/shared/core/decorators/api.decorator";
import { UserDecorator } from "src/shared/core/decorators/user.decorator";

@Controller('conversations/:conversationId/messages')
export class MessageController{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ){}

  @ApiDecorator({ isPublic: false })
  @Get()
  async getMessages(
    @UserDecorator() user: IUserToSign,
    @Param('conversationId') conversationId: UUID,
    @Query() input: FindMessagesInput
  ){
    return this.queryBus.execute(new FindMessagesQuery(user.id, conversationId, input));
  }

  @ApiDecorator({ isPublic: false })
  @Patch(':messageId')
  async modifyMessage(
    @UserDecorator() user: IUserToSign,
    @Param('messageId') messageId: UUID,
    @Param('conversationId') conversationId: UUID,
    @Body() input: UpdateMessagesInput
  ){
    return this.commandBus.execute(new UpdateMessageCommand(user.id, messageId, conversationId, input));
  }

  @ApiDecorator({ isPublic: false })
  @Delete(':messageId')
  async deleteMessage(
    @UserDecorator() user: IUserToSign,
    @Param('messageId') messageId: UUID,
    @Param('conversationId') conversationId: UUID
  ){
    return {};
  }
}