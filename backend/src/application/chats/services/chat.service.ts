import { Inject, Injectable } from "@nestjs/common";
import { IMessageRepository, IMessageRepositoryToken } from "src/domain/messages/repositories/message-repository.interface";
import { SendMessageInput } from "../dtos/send-message.input";
import { UUID } from "crypto";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { Transactional } from "typeorm-transactional";
import { ConversationNotFoundException } from "src/shared/core/exceptions/not-found/conversation-not-found.exception";
import { MessageOutput } from "src/application/messages/dtos/message.output";
import { IUserToSign } from "src/application/auth/interfaces/user-to-sign.interface";
import { User } from "src/domain/users/users";
import { IChatPublisher, IChatPublisherToken } from "../publishers/chat-publisher.interface";
import { MessageCreatedIntegrationEvent } from "../integration-event/message-created.integration-event";

@Injectable()
export class ChatService {
  constructor(
    @Inject(IMessageRepositoryToken)
    private readonly messageRepository: IMessageRepository,

    @Inject(IConversationRepositoryToken)
    private readonly conversationRepository: IConversationRepository,

    @Inject(IChatPublisherToken)
    private readonly chatPublisher: IChatPublisher
  ) {}

  @Transactional()
  async saveMessage(sender: IUserToSign, input: SendMessageInput) {
    await this.findConversationOrThrow(sender.id, input.conversationId);
    const message = input.toEntity(sender.id);
    const savedMessage = await this.messageRepository.save(message);
    this.chatPublisher.publishMessageCreated(new MessageCreatedIntegrationEvent(
      input.conversationId,
      `${sender.name}: ${savedMessage.content}`,
      savedMessage.createdAt
    ));
    const senderUser = User.assign(sender.id, sender.role, sender.name, sender.bornYear, sender.email, sender.avatar);
    return new MessageOutput(savedMessage, senderUser);
  }

  async findConversationOrThrow(userId: UUID, conversationId: UUID) {
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new ConversationNotFoundException(conversationId);
    }
    conversation.requestToView(userId);
    return conversation;
  }
}
