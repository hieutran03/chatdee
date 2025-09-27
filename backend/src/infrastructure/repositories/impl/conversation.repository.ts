import { Get, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";
import { IConversationRepository } from "src/domain/conversations/repositories/conversation-repository.interface";
import { ConversationOrm } from "src/infrastructure/relational-database/orm/conversation.orm";
import { ConversationTypeEnum } from "src/shared/common/enums/conversations.enum";
import { In, Repository, SelectQueryBuilder } from "typeorm";
import { ConversationAdapter } from "../adapter/conversation.adapter";
import { Conversation } from "src/domain/conversations/conversation";
import { IUserInConversationRepository, IUserInConversationRepositoryToken } from "src/domain/conversations/repositories/user-in-conversation-repository.interface";
import { IAdapter } from "src/shared/common/interfaces/adapter.interface";
import { User } from "src/domain/users/users";
import { UserOrm } from "src/infrastructure/relational-database/orm/user.orm";
import { UserAdapter } from "../adapter/user.adapter";
import { UserInConversationOrm } from "src/infrastructure/relational-database/orm/user-in-conversation.orm";
import { cursorPaginate } from "src/shared/core/utils/cursor-pagination.util";
import { Direction } from "src/shared/common/enums/direction.enum";
import { ConversationPaginationContract } from "src/domain/conversations/contracts/conversation-pagination.contract";
import { TCursor } from "src/shared/common/types/cursor.type";
import { ConversationExtraInfoContract } from "src/domain/conversations/contracts/conversation-extra-info.contract";
import { ConversationDetailContract } from "src/domain/conversations/contracts/conversation-detail.contract";

@Injectable()
export class ConversationRepository implements IConversationRepository {
  constructor(
    @InjectRepository(ConversationOrm)
    private readonly conversationRepository: Repository<ConversationOrm>,
    @InjectRepository(UserOrm)
    private readonly userRepository: Repository<UserOrm>,
    @Inject(IUserInConversationRepositoryToken) 
    private readonly userInConversationRepository: IUserInConversationRepository,
    @Inject(ConversationAdapter)
    private readonly conversationAdapter: IAdapter<Conversation, ConversationOrm>,
    @Inject(UserAdapter)
    private readonly userAdapter: IAdapter<User, UserOrm>,
  ){}

  async findWithCursorPagination(userId: UUID, limit: number, cursor: TCursor, direction: Direction): Promise<ConversationPaginationContract> {
    const qb = this.conversationRepository.createQueryBuilder('conversation').where(
      qb => {
      const subQuery = this.queryToFindConversationIdsOfUser(qb, userId);
      return 'conversation.id IN ' + subQuery;
    });
    
    const result = await cursorPaginate(qb, limit, cursor, 'createdAt', direction);
    const conversations = result.data.map(item => this.conversationAdapter.toEntity(item));
    return {
      conversations,
      limit,
      nextCursor: result.nextCursor,
      previousCursor: result.previousCursor
    };
  }

  async findDirectConversation(firstUserId: UUID, secondUserId: UUID): Promise<Conversation | null> {
    const conversationOrm = await this.conversationRepository.createQueryBuilder('conversation')
      .innerJoin('conversation.userInConversations', 'uic')
      .where('conversation.type = :type', { type: ConversationTypeEnum.DIRECT_CHAT })
      .andWhere('uic.userId IN (:...userIds)', { userIds: [firstUserId, secondUserId] })
      .getOne();
    console.log('Direct conversation ORM:', conversationOrm);
    return conversationOrm ? this.conversationAdapter.toEntity(conversationOrm) : null;
  }

  async findTopUsersAndTotal(conversationId: UUID, limit: number): Promise<ConversationExtraInfoContract> {
    const userOrms = await this.userRepository.createQueryBuilder('user')
      .innerJoin(UserInConversationOrm, 'uic', 'user.id = uic.userId')
      .where('uic.conversationId = :conversationId', { conversationId })
      .limit(limit)
      .getMany();
    const users = userOrms.map(orm => this.userAdapter.toEntity(orm));
    const total = await this.countUsersOfConversation();
   return { topUsers: users, totalUsers: total };
  }

  async countUsersOfConversation(): Promise<number> {
    const count = await this.conversationRepository.createQueryBuilder('conversation')
      .leftJoin('conversation.userInConversations', 'uic')
      .getCount();
    return count;
  }

  async save(conversation: Conversation): Promise<Conversation> {
    const conversationOrm = this.conversationRepository.create(this.conversationAdapter.toOrm(conversation));
    await this.conversationRepository.save(conversationOrm);
    return this.conversationAdapter.toEntity(conversationOrm);
  }

  async findByIdDetails(id: UUID): Promise<ConversationDetailContract> {
    const conversationOrm = await this.conversationRepository.findOne({ 
      where: { id },
      relations: ['userInConversations', 'createdBy']
    });
    if(!conversationOrm)
      return null;
    const conversation = conversationOrm ? this.conversationAdapter.toEntity(conversationOrm) : null;
    const userIds = conversationOrm?.userInConversations.map(uic => uic.userId);
    const members = await this.userRepository.findBy({ id: In(userIds) });
    return new ConversationDetailContract(
      conversation, 
      conversationOrm.createdAt, 
      conversationOrm.updatedAt, 
      members.map(member => this.userAdapter.toEntity(member)),
      this.userAdapter.toEntity(conversationOrm.createdBy)
    );
  }

   async findById(id: UUID): Promise<Conversation> {
    console.log('Finding conversation by ID:', id);
    const conversationOrm = await this.conversationRepository.findOne({ 
      where: { id },
      relations: ['userInConversations']
    });
    return conversationOrm ? this.conversationAdapter.toEntity(conversationOrm) : null;
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

  async delete(id: UUID): Promise<void> {
    await this.conversationRepository.delete(id);
  }

  private queryToFindConversationIdsOfUser(qb: SelectQueryBuilder<ConversationOrm>, userId: UUID){
    return qb.subQuery()
        .select('uic.conversationId')
        .from(UserInConversationOrm, 'uic')
        .where('uic.userId = :userId', { userId })
        .getQuery();
  }
}