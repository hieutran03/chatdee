import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateConversationCommand } from 'src/application/conversations/commands/create-conversation.command';
import { CreateConversationInput } from 'src/application/conversations/dtos/create-conversation.input';
import { ApiDecorator } from 'src/shared/core/decorators/api.decorator';
import { UserDecorator } from 'src/shared/core/decorators/user.decorator';
import {
  ConversationOperation,
  ConversationResponseSwagger,
} from '../swagger/conversation-response.swagger';
import { AddToConversationCommand } from 'src/application/conversations/commands/add-to-conversation.command';
import { UUID } from 'crypto';
import { RemoveFromConversationCommand } from 'src/application/conversations/commands/remove-from-conversation.command';
import { FindConversationsInput } from 'src/application/conversations/dtos/find-conversations.input';
import { FindConversationsQuery } from 'src/application/conversations/queries/find-conversations.query';
import { FindConversationByIdQuery } from 'src/application/conversations/queries/find-conversation-by-id.query';
import { UpdateConversationInput } from 'src/application/conversations/dtos/update-conversation.input';
import { UpdateConversationCommand } from 'src/application/conversations/commands/update-conversation.command';
import { DeleteConversationCommand } from 'src/application/conversations/commands/delete-conversation.command';
import { IUserToSign } from 'src/application/auth/interfaces/user-to-sign.interface';
import { UpdateMemberInput } from 'src/application/conversations/dtos/update-member.input';
import { UpdateMemberCommand } from 'src/application/conversations/commands/update-member.command';
import { ChangeOwnerCommand } from 'src/application/conversations/commands/change-owner.command';
import { FindMembersQuery } from 'src/application/conversations/queries/find-members.query';

@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiDecorator({ isPublic: false })
  @Get(':conversationId')
  getConversationById(
    @UserDecorator() user: IUserToSign,
    @Param('conversationId') conversationId: UUID,
  ) {
    return this.queryBus.execute(new FindConversationByIdQuery(user.id, conversationId));
  }

  @ConversationResponseSwagger(ConversationOperation.getConversations)
  @ApiDecorator({ isPublic: false })
  @Get()
  getConversations(
    @UserDecorator() user: IUserToSign,
    @Query() query: FindConversationsInput,
  ) {
    return this.queryBus.execute(new FindConversationsQuery(user.id, query));
  }

  @ConversationResponseSwagger(ConversationOperation.create)
  @ApiDecorator({ isPublic: false })
  @Post()
  async createConversation(
    @UserDecorator() user: IUserToSign,
    @Body() createConversationInput: CreateConversationInput,
  ) {
    return this.commandBus.execute(new CreateConversationCommand(user.id, createConversationInput));
  }

  @ApiDecorator({ isPublic: false })
  @Patch('/:conversationId')
  async updateConversation(
    @Param('conversationId') conversationId: UUID,
    @Body() payload: UpdateConversationInput,
  ) {
    return this.commandBus.execute(new UpdateConversationCommand(conversationId, payload));
  }

  @ApiDecorator({ isPublic: false })
  @Delete('/:conversationId')
  async deleteConversation(@Param('conversationId') conversationId: UUID, @UserDecorator() user: IUserToSign) {
    return this.commandBus.execute(new DeleteConversationCommand(user.id, conversationId));
  }

  @ApiDecorator({ isPublic: false })
  @Get('/:conversationId/members')
  async getMembers(@Param('conversationId') conversationId: UUID) {
    return this.queryBus.execute(new FindMembersQuery(conversationId));
  }

  @ConversationResponseSwagger(ConversationOperation.addMember)
  @ApiDecorator({ isPublic: false })
  @Post('/:conversationId/members/:memberId')
  async addMember(
    @UserDecorator() user: IUserToSign,
    @Param('conversationId') conversationId: UUID,
    @Param('memberId') memberId: UUID,
  ) {
    return this.commandBus.execute(new AddToConversationCommand(user.id, conversationId, memberId));
  }

  @ApiDecorator({ isPublic: false })
  @Patch('/:conversationId/members/:memberId')
  async updateMember(
    @UserDecorator() user: IUserToSign,
    @Param('conversationId') conversationId: UUID,
    @Param('memberId') memberId: UUID,
    @Body() input: UpdateMemberInput,
  ) {
    return this.commandBus.execute(new UpdateMemberCommand(conversationId, user.id, memberId, input));
  }

  @ConversationResponseSwagger(ConversationOperation.removeMember)
  @ApiDecorator({ isPublic: false })
  @Delete('/:conversationId/members/:memberId')
  async removeMember(
    @UserDecorator() user: IUserToSign,
    @Param('conversationId') conversationId: UUID,
    @Param('memberId') memberId: UUID,
  ) {
    return this.commandBus.execute(new RemoveFromConversationCommand(user.id, conversationId, memberId));
  }

  @ApiDecorator({ isPublic: false })
  @Post('/:conversationId/owner/:userId')
  async changeOwner(
    @UserDecorator() user: IUserToSign,
    @Param('conversationId') conversationId: UUID,
    @Param('userId') ownerId: UUID,
  ) {
    return this.commandBus.execute(new ChangeOwnerCommand(user.id, conversationId, ownerId));
  }
}
