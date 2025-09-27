import { Inject } from "@nestjs/common";
import { IMessageRepository, IMessageRepositoryToken } from "src/domain/messages/repositories/message-repository.interface";
import { FindMessagesInput } from "../dtos/find-messages.input";
import { UUID } from "crypto";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { ConversationNotFoundException } from "src/shared/core/exceptions/not-found/conversation-not-found.exception";
import { UserNotInConversationException } from "src/shared/core/exceptions/forbidden/user-not-in-conversation.exception";

export class MessageService {
  constructor(
    @Inject(IMessageRepositoryToken)
    private readonly messageRepository: IMessageRepository,
    @Inject(IConversationRepositoryToken)
    private readonly conversationRepository: IConversationRepository,
  ){}

  async getMessages(userId: UUID, conversationId: UUID, input: FindMessagesInput) {
    const conversation = await this.conversationRepository.findById(conversationId);
    if(!conversation)
      return new ConversationNotFoundException(conversationId);
    if(!conversation.canViewConversation(userId))
      return new UserNotInConversationException(conversationId);

    return this.messageRepository.findWithCursorPagination(conversationId, input.limit, input.cursor, input.direction);
  }
}