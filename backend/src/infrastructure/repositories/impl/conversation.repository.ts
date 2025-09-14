import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";
import { IConversationRepository } from "src/domain/abstractions/repositories/conversation-repository.interface";
import { ConversationOrm } from "src/infrastructure/relational-database/orm/conversation.orm";
import { ConversationTypeEnum } from "src/shared/common/enums/conversations.enum";
import { In, Repository } from "typeorm";
import { ConversationAdapter } from "../adapter/conversation.adapter";
import { Conversation } from "src/domain/conversations/conversation";
import { IUserInConversationRepository, IUserInConversationRepositoryToken } from "src/domain/abstractions/repositories/user-in-conversation-repository.interface";

@Injectable()
export class ConversationRepository implements IConversationRepository {
  constructor(
    @InjectRepository(ConversationOrm)
    private readonly conversationRepository: Repository<ConversationOrm>,
    @Inject(IUserInConversationRepositoryToken) 
    private readonly userInConversationRepository: IUserInConversationRepository,
    private readonly conversationAdapter: ConversationAdapter
  ){}

  async findDirectConversation(firstUserId: UUID, secondUserId: UUID): Promise<Conversation | null> {
    // const subQuery = this.conversationRepository
    //   .createQueryBuilder('conversation')
    //   .innerJoin('conversation.userInConversations', 'uic')
    //   .innerJoin('uic.user', 'user')
    //   .where('conversation.type = :type', { type: ConversationTypeEnum.DIRECT_CHAT })
    //   .andWhere('user.id IN (:...userIds)', { userIds: [firstUserId, secondUserId] })
    //   .groupBy('conversation.id')
    //   .having('COUNT(DISTINCT user.id) = 2')
    //   .select('conversation.id');

    // const conversation = await this.conversationRepository
    //   .createQueryBuilder('conversation')
    //   .innerJoinAndSelect('conversation.userInConversations', 'uic')
    //   .innerJoinAndSelect('uic.user', 'user')
    //   .where('conversation.id IN (' + subQuery.getQuery() + ')')
    //   .setParameters(subQuery.getParameters())
    //   .getOne();
    
    // return conversation ? this.conversationAdapter.toEntity(conversation) : null;
    throw new Error('Method not implemented.');
  }

  async save(conversation: Conversation): Promise<Conversation> {
    const conversationOrm = this.conversationRepository.create(this.conversationAdapter.toOrm(conversation));
    await this.conversationRepository.save(conversationOrm);
    return this.conversationAdapter.toEntity(conversationOrm);
  }

  async findByUserId(userId: UUID): Promise<Conversation[]> {
    const userInConversations = await this.userInConversationRepository.findAllConversationsOfUser(userId);
    const conversationIds = userInConversations.map(uic => uic.conversationId);
    if(conversationIds.length === 0) return [];
    const conversationOrms = await this.conversationRepository.find({ 
      where: { id: In(conversationIds) },
      relations: ['userInConversations', 'userInConversations.user', 'createdBy']
    });
    return conversationOrms.map(item => this.conversationAdapter.toEntity(item));
  }

  async update(id: UUID, conversation: Conversation): Promise<void> {
    const conversationOrm = this.conversationAdapter.toOrm(conversation);
    await this.conversationRepository.update(id, conversationOrm);
  }
}