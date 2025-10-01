import { Inject } from "@nestjs/common";
import { IMessageRepository, IMessageRepositoryToken } from "../repositories/message-repository.interface";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { UUID } from "crypto";
import { MessageNotInConversationException } from "src/shared/core/exceptions/conflict/message-not-in-conversation.exception";
import { MessageNotFoundException } from "src/shared/core/exceptions/not-found/message-not-found.exception";

export class MessageDomainService {
  constructor(
    @Inject(IMessageRepositoryToken)
    private readonly messageRepository: IMessageRepository,
    @Inject(IConversationRepositoryToken)
    private readonly conversationRepository: IConversationRepository,
  ){}

  async updateMessage(userId: UUID, messageId: UUID, conversationId: UUID, content: string) {
    const conversation = await this.conversationRepository.findById(conversationId);
    conversation.requestToView(userId);
    const message = await this.findMessageInConversation(messageId, conversationId);
    message.update(userId, content);
    await this.messageRepository.save(message);
    return message;
  }

  private async findMessageInConversation(messageId: UUID, conversationId: UUID) {
    const message = await this.messageRepository.findById(messageId);
    if(!message){
      throw new MessageNotFoundException(messageId);
    }
    if(message.conversationId !== conversationId)
      throw new MessageNotInConversationException(messageId, conversationId);
    return message;
  }
}