import { Inject, Injectable } from "@nestjs/common";
import { IMessageRepository, IMessageRepositoryToken } from "src/domain/messages/repositories/message-repository.interface";
import { SendMessageInput } from "../dtos/send-message.input";
import { IUserInConversationRepository, IUserInConversationRepositoryToken } from "src/domain/conversations/repositories/user-in-conversation-repository.interface";
import { WsException } from "@nestjs/websockets";
import { UUID } from "crypto";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class ChatService {
  constructor(
    @Inject(IMessageRepositoryToken)
    private readonly messageRepository: IMessageRepository,
    @Inject(IUserInConversationRepositoryToken)
    private readonly userInConversationRepository: IUserInConversationRepository,
    @Inject(IConversationRepositoryToken)
    private readonly conversationRepository: IConversationRepository,
  ) {}

  @Transactional()
  async saveMessage(senderId: UUID, input: SendMessageInput): Promise<void> {
    await this.findUserInConversation(senderId, input.conversationId);
    const message = input.toEntity(senderId);
    await this.messageRepository.save(message);
  }

  async findConversation(conversationId: UUID) {
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new WsException('Conversation not found');
    }
    return conversation;
  }

  async findUserInConversation(userId: UUID, conversationId: UUID){
    const userInConversation = await this.userInConversationRepository.findParticipant(userId, conversationId);
    if (!userInConversation) {
      throw new WsException('User is not a participant of the conversation');
    }
    return userInConversation;
  }
}
