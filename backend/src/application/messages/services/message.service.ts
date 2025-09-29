import { Inject } from "@nestjs/common";
import { IMessageRepository, IMessageRepositoryToken } from "src/domain/messages/repositories/message-repository.interface";
import { FindMessagesInput } from "../dtos/find-messages.input";
import { UUID } from "crypto";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { ConversationNotFoundException } from "src/shared/core/exceptions/not-found/conversation-not-found.exception";

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
    conversation.requestToView(userId);

    return this.messageRepository.findWithCursorPagination(conversationId, input.limit, input.cursor, input.direction);
  }
}