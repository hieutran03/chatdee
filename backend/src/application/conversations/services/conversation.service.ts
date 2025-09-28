import { Inject, Injectable } from "@nestjs/common";
import { ConversationManagerService } from "src/domain/conversations/manager-service/conversation.manager-service";
import { CreateConversationInput } from "../dtos/create-conversation.input";
import { UUID } from "crypto";
import { Conversation } from "src/domain/conversations/conversation";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { ConversationTypeEnum } from "src/shared/common/enums/conversations.enum";
import { ConversationNotFoundException } from "src/shared/core/exceptions/not-found/conversation-not-found.exception";
import { FindConversationsInput } from "../dtos/find-conversations.input";
import { EventBus } from "@nestjs/cqrs";
import { UpdateConversationInput } from "../dtos/update-conversation.input";
import { DeleteConversationEvent } from "src/domain/conversations/events/delete-conversation.event";
import { UserNotInConversationException } from "src/shared/core/exceptions/forbidden/user-not-in-conversation.exception";

@Injectable()
export class ConversationService{
  constructor(
    private conversationManagerService: ConversationManagerService,
    @Inject(IConversationRepositoryToken) private conversationRepository: IConversationRepository,
    private readonly eventBus: EventBus
  ){}

  async findConversations(userId: UUID, query: FindConversationsInput){
    return this.conversationRepository.findWithCursorPagination(userId, query.limit, query.cursor, query.direction);
  }

  async findById(userId: UUID, conversationId: UUID) {
    const conversation = await this.conversationRepository.findByIdDetails(conversationId);
    if (!conversation)
      return new ConversationNotFoundException(conversationId);
    if (!conversation.canViewConversation(userId))
      return new UserNotInConversationException(conversationId);
    const topUsersAndTotal = await this.getConversationExtraInfo(conversation, 5);
    return { conversation, topUsersAndTotal };
  }

  async create(creatorId: UUID,{ title, theme, avatar, targetUserIds }: CreateConversationInput){
    const allUserIds = await this.removeDuplicatedUserIds([creatorId, ...targetUserIds]);
    await this.conversationManagerService.validateConversation(allUserIds);
    const conversation = Conversation.create(creatorId, allUserIds, title, theme, avatar);
    return this.conversationRepository.save(conversation);
  }

  async update(conversationId: UUID, payload: UpdateConversationInput){
    const conversation = await this.conversationRepository.findById(conversationId);
    if(!conversation)
      throw new ConversationNotFoundException(conversationId);
    conversation.update(payload.toContract());
    await this.conversationRepository.update(conversation.id, conversation);
  }

  async delete(conversationId: UUID){
    const conversation = await this.conversationRepository.findById(conversationId);
    if(!conversation)
      throw new ConversationNotFoundException(conversationId); 
    this.eventBus.publish(new DeleteConversationEvent(conversationId));
  }

  async getConversationExtraInfo(conversation: Conversation, limit: number = 3){
    if(conversation.type == ConversationTypeEnum.GROUP_CHAT && (!conversation.title || !conversation.avatar))
      return this.conversationRepository.findTopUsersAndTotal(conversation.id, limit);
    return null;
  }

  async addToConversation(addedBy: UUID, conversationId: UUID, addedUser: UUID){
    const conversation = await this.conversationRepository.findById(conversationId);
    if(!conversation.canViewConversation(addedBy))
      throw new UserNotInConversationException(conversationId);
    if(!conversation)
      throw new ConversationNotFoundException(conversationId);
    conversation.addParticipant(addedBy, addedUser);
    await this.conversationRepository.save(conversation);
    // const events = conversation.pullDomainEvents();
    // await Promise.all(events.map(event => this.eventBus.publish(event)));
  }

  async removeFromConversation(removedBy: UUID, conversationId: UUID, removedUser: UUID){
    const conversation = await this.conversationRepository.findById(conversationId);
    if(!conversation)
      throw new ConversationNotFoundException(conversationId);
    conversation.removeParticipant(removedBy, removedUser);
    await this.conversationRepository.save(conversation);
    // const events = conversation.pullDomainEvents();
    // events.forEach(event => this.eventBus.publish(event));
  }

  private async removeDuplicatedUserIds(userIds: UUID[]): Promise<UUID[]>{
    return Array.from(new Set(userIds));
  }
}