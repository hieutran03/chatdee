import { Inject, Injectable } from "@nestjs/common";
import { ConversationDomainService } from "src/domain/conversations/domain-service/create-conversation.domain-service";
import { CreateConversationInput } from "../dtos/create-conversation.input";
import { UUID } from "crypto";
import { Conversation } from "src/domain/conversations/conversation";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { ConversationNotFoundException } from "src/shared/core/exceptions/not-found/conversation-not-found.exception";
import { FindConversationsInput } from "../dtos/find-conversations.input";
import { EventBus } from "@nestjs/cqrs";
import { UpdateConversationInput } from "../dtos/update-conversation.input";
import { publishDomainEvents } from "src/shared/core/utils/domain-event.util";
import { UpdateMemberInput } from "../dtos/update-member.input";
import { FindMembersInput } from "../dtos/find-members.input";

@Injectable()
export class ConversationService{
  constructor(
    private conversationDomainService: ConversationDomainService,
    @Inject(IConversationRepositoryToken) private conversationRepository: IConversationRepository,
    private readonly eventBus: EventBus
  ){}

  async findConversations(userId: UUID, query: FindConversationsInput){
    // return this.conversationRepository.findWithCursorPagination(userId, query.limit, query.cursor, query.direction);
    return this.conversationRepository.findWithCursorPagination(userId, query.limit, query.cursor);
  }

  async getMembers(conversationId: UUID, query: FindMembersInput){
    const conversation = await this.conversationRepository.findById(conversationId);
    if(!conversation)
      return new ConversationNotFoundException(conversationId);
    return this.conversationRepository.findMembersWithCursorPagination(conversationId, query.limit, query.cursor);
  }

  async getTopMembers(conversationId: UUID, limit: number){
    return this.conversationRepository.findTopMembers(conversationId, limit);
  }
  
  async getTotalMembers(conversationId: UUID){
    return this.conversationRepository.countMembers(conversationId);
  }

  async findById(userId: UUID, conversationId: UUID) {
    const conversation = await this.conversationRepository.findByIdDetails(conversationId);
    if (!conversation)
      return new ConversationNotFoundException(conversationId);
    conversation.requestToView(userId);
    const topMembers = await this.getTopMembers(conversationId, 3);
    const totalMembers = await this.getTotalMembers(conversationId);
    return { conversation, topMembers, totalMembers };
  }

  async create(creatorId: UUID,{ title, theme, avatar, targetUserIds }: CreateConversationInput){
    const allUserIds = this.removeDuplicatedUserIds([creatorId, ...targetUserIds]);
    await this.conversationDomainService.validateConversation(allUserIds);
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
    await this.conversationRepository.save(conversation);
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


  async addToConversation(addedById: UUID, conversationId: UUID, memberId: UUID){
    const conversation = await this.findConversation(conversationId);
    conversation.addMember(addedById, memberId);
    await this.conversationRepository.save(conversation);
    publishDomainEvents(this.eventBus, conversation);
  }

  async removeFromConversation(removedById: UUID, conversationId: UUID, memberId: UUID){
    const conversation = await this.findConversation(conversationId);
    conversation.removeMember(removedById, memberId);
    await this.conversationRepository.save(conversation);
    publishDomainEvents(this.eventBus, conversation);
  }

  async updateMember(conversationId: UUID, updatedById: UUID, memberId: UUID, input: UpdateMemberInput){
    const conversation = await this.findConversation(conversationId);
    conversation.updateMember(updatedById, memberId, input.toContract());
    await this.conversationRepository.save(conversation);
    publishDomainEvents(this.eventBus, conversation);
  }

  async changeOwner(conversationId: UUID, currentOwnerId: UUID, newOwnerId: UUID){
    const conversation = await this.findConversation(conversationId);
    conversation.changeOwner(currentOwnerId, newOwnerId);
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