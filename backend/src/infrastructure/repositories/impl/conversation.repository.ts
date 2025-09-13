import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";
import { IConversationRepository } from "src/domain/abstractions/repositories/conversation-repository.interface";
import { ConversationOrm } from "src/infrastructure/relational-database/orm/conversation.orm";
import { ConversationTypeEnum } from "src/shared/common/enums/conversations.enum";
import { Repository } from "typeorm";
import { ConversationAdapter } from "../adapter/conversation.adapter";
import { Conversation } from "src/domain/conversations/conversation";

@Injectable()
export class ConversationRepository implements IConversationRepository {
  constructor(
    @InjectRepository(ConversationOrm)
    private readonly conversationRepository: Repository<ConversationOrm>,
    private readonly conversationAdapter: ConversationAdapter
  ){}

  async findDirectConversation(firstUserId: UUID, secondUserId: UUID): Promise<Conversation | null> {
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.users', 'user')
      .where('conversation.type = :type', { type: ConversationTypeEnum.DIRECT_CHAT })
      .where('user.id IN (:...userIds)', { userIds: [firstUserId, secondUserId] })
      .groupBy('conversation.id')
      .having('COUNT(DISTINCT user.id) = 2')
      .getOne();
    return this.conversationAdapter.toEntity(conversation);
  }

  async save(conversation: Conversation): Promise<Conversation> {
    const conversationOrm = this.conversationRepository.create(this.conversationAdapter.toOrm(conversation));
    await this.conversationRepository.save(conversationOrm);
    return this.conversationAdapter.toEntity(conversationOrm);
  }

  async findByUserId(userId: UUID): Promise<Conversation[]> {
    const conversationOrms = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
    return conversationOrms.map(item => this.conversationAdapter.toEntity(item));
  }

  async update(id: UUID, conversation: Conversation): Promise<void> {
    const conversationOrm = this.conversationAdapter.toOrm(conversation);
    await this.conversationRepository.update(id, conversationOrm);
  }
}