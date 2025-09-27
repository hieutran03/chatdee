import { Controller, Delete, Get, Param, Patch, Query } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { UUID } from "crypto";
import { IUserToSign } from "src/application/auth/interfaces/user-to-sign.interface";
import { FindMessagesInput } from "src/application/messages/dtos/find-messages.input";
import { FindMessagesQuery } from "src/application/messages/queries/find-messages.query";
import { ApiDecorator } from "src/shared/core/decorators/api.decorator";
import { UserDecorator } from "src/shared/core/decorators/user.decorator";

@Controller('conversations/:conversationId/messages')
export class MessageController{
  constructor(
    private readonly queryBus: QueryBus
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
  @Patch()
  async modifyMessage(){
    return {};
  }

  @ApiDecorator({ isPublic: false })
  @Delete()
  async deleteMessage(){
    return {};
  }
}