import { Inject, Injectable } from "@nestjs/common";
import { CreateConversationDomainService } from "src/domain/conversations/domain-service/create-conversation.domain-service";
import { CreateConversationInput } from "../dtos/create-conversation.input";
import { UUID } from "crypto";
import { Conversation } from "src/domain/conversations/conversation";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { ConversationTypeEnum } from "src/shared/common/enums/conversations.enum";
import { ConversationNotFoundException } from "src/shared/core/exceptions/not-found/conversation-not-found.exception";
import { FindConversationsInput } from "../dtos/find-conversations.input";
import { EventBus } from "@nestjs/cqrs";
import { UpdateConversationInput } from "../dtos/update-conversation.input";
import { publishDomainEvents } from "src/shared/core/utils/domain-event.util";
import { UpdateMemberInput } from "../dtos/update-member.input";

@Injectable()
export class ConversationService{
  constructor(
    private createConversationDomainService: CreateConversationDomainService,
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
    conversation.requestToView(userId);
    const topUsersAndTotal = await this.getConversationExtraInfo(conversation, 5);
    return { conversation, topUsersAndTotal };
  }

  async create(creatorId: UUID,{ title, theme, avatar, targetUserIds }: CreateConversationInput){
    const allUserIds = this.removeDuplicatedUserIds([creatorId, ...targetUserIds]);
    await this.createConversationDomainService.validateConversation(allUserIds);
    const conversation = Conversation.create(creatorId, allUserIds, title, theme, avatar);
    const result = await this.conversationRepository.save(conversation);
    publishDomainEvents(this.eventBus, conversation);
    return result;
  }

  async update(conversationId: UUID, payload: UpdateConversationInput){
    const conversation = await this.conversationRepository.findById(conversationId);
    if(!conversation)
      throw new ConversationNotFoundException(conversationId);
    conversation.update(payload.toContract());
    await this.conversationRepository.update(conversation.id, conversation);
    publishDomainEvents(this.eventBus, conversation);
  }

  async delete(userId: UUID, conversationId: UUID){
    const conversation = await this.conversationRepository.findById(conversationId);
    if(!conversation)
      throw new ConversationNotFoundException(conversationId);
    conversation.requestToDelete(userId)
    await this.conversationRepository.delete(conversationId);
    publishDomainEvents(this.eventBus, conversation);
  }

  async getConversationExtraInfo(conversation: Conversation, limit: number = 3){
    if(conversation.type == ConversationTypeEnum.GROUP_CHAT && (!conversation.title || !conversation.avatar))
      return this.conversationRepository.findTopUsersAndTotal(conversation.id, limit);
    return null;
  }

  async addToConversation(addedBy: UUID, conversationId: UUID, addedUser: UUID){
    const conversation = await this.findConversation(conversationId);
    conversation.addParticipant(addedBy, addedUser);
    await this.conversationRepository.save(conversation);
    publishDomainEvents(this.eventBus, conversation);
  }

  async removeFromConversation(removedBy: UUID, conversationId: UUID, removedUser: UUID){
    const conversation = await this.findConversation(conversationId);
    conversation.removeParticipant(removedBy, removedUser);
    await this.conversationRepository.save(conversation);
    publishDomainEvents(this.eventBus, conversation);
  }

  async updateMember(conversationId: UUID, updatedBy: UUID, updatedUser: UUID, input: UpdateMemberInput){
    const conversation = await this.findConversation(conversationId);
    conversation.updateParticipant(updatedBy, updatedUser, input.toContract());
    await this.conversationRepository.save(conversation);
    publishDomainEvents(this.eventBus, conversation);
  }

  async changeOwner(conversationId: UUID, updatedBy: UUID, newOwner: UUID){
    const conversation = await this.findConversation(conversationId);
    conversation.changeOwner(updatedBy, newOwner);
    await this.conversationRepository.save(conversation);
    publishDomainEvents(this.eventBus, conversation);
  }
  
  private  removeDuplicatedUserIds(userIds: UUID[]){
    return Array.from(new Set(userIds));
  }

  private async findConversation(conversationId: UUID){
    const conversation = await this.conversationRepository.findById(conversationId);
    if(!conversation)
      throw new ConversationNotFoundException(conversationId);
    return conversation;
  }
}