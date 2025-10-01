import { Inject, Injectable } from "@nestjs/common";
import { IMessageRepository, IMessageRepositoryToken } from "src/domain/messages/repositories/message-repository.interface";
import { SendMessageInput } from "../dtos/send-message.input";
import { UUID } from "crypto";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { Transactional } from "typeorm-transactional";
import { ConversationNotFoundException } from "src/shared/core/exceptions/not-found/conversation-not-found.exception";

@Injectable()
export class ChatService {
  constructor(
    @Inject(IMessageRepositoryToken)
    private readonly messageRepository: IMessageRepository,

    @Inject(IConversationRepositoryToken)
    private readonly conversationRepository: IConversationRepository,
  ) {}

  @Transactional()
  async saveMessage(senderId: UUID, input: SendMessageInput): Promise<void> {
    await this.findConversation(senderId, input.conversationId);
    const message = input.toEntity(senderId);
    await this.messageRepository.save(message);
  }

  async findConversation(userId: UUID, conversationId: UUID) {
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new ConversationNotFoundException(conversationId);
    }
    conversation.requestToView(userId);
    return conversation;
  }
}
