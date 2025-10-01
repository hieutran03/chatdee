import { Inject } from "@nestjs/common";
import { IMessageRepository, IMessageRepositoryToken } from "src/domain/messages/repositories/message-repository.interface";
import { FindMessagesInput } from "../dtos/find-messages.input";
import { UUID } from "crypto";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { ConversationNotFoundException } from "src/shared/core/exceptions/not-found/conversation-not-found.exception";
import { UpdateMessagesInput } from "../dtos/update-messages.input";
import { MessageDomainService } from "src/domain/messages/domain-services/message.domain-service";
import { publishDomainEvents } from "src/shared/core/utils/domain-event.util";
import { EventBus } from "@nestjs/cqrs";

export class MessageService {
  constructor(
    @Inject(IMessageRepositoryToken)
    private readonly messageRepository: IMessageRepository,
    @Inject(IConversationRepositoryToken)
    private readonly conversationRepository: IConversationRepository,
    private readonly messageDomainService: MessageDomainService,
    private readonly eventBus: EventBus
  ){}

  async getMessages(userId: UUID, conversationId: UUID, input: FindMessagesInput) {
    const conversation = await this.conversationRepository.findById(conversationId);
    if(!conversation)
      return new ConversationNotFoundException(conversationId);
    conversation.requestToView(userId);

    return this.messageRepository.findWithCursorPagination(conversationId, input.limit, input.cursor, input.direction);
  }

  async update(userId: UUID, messageId: UUID, conversationId: UUID, input: UpdateMessagesInput) {
    const message = await this.messageDomainService.updateMessage(userId, messageId, conversationId, input.content);

    publishDomainEvents(this.eventBus, message);
  }
}
