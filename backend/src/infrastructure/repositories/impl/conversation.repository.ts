import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";
import { IConversationRepository } from "src/domain/conversations/repositories/conversation-repository.interface";
import { ConversationOrm } from "src/infrastructure/relational-database/orm/conversation.orm";
import { ConversationTypeEnum } from "src/domain/conversations/enums/conversations.enum";
import { In, Repository, SelectQueryBuilder } from "typeorm";
import { ConversationAdapter } from "../adapter/conversation.adapter";
import { Conversation } from "src/domain/conversations/conversation";
import { IAdapter } from "src/shared/common/interfaces/adapter.interface";
import { UserInConversationOrm } from "src/infrastructure/relational-database/orm/user-in-conversation.orm";
import { cursorPaginate } from "src/shared/core/utils/cursor-pagination.util";
import { Direction } from "src/shared/common/enums/direction.enum";
import { ConversationPaginationContract } from "src/domain/conversations/contracts/conversation-pagination.contract";
import { TCursor } from "src/shared/common/types/cursor.type";
import { ConversationDetailContract } from "src/domain/conversations/contracts/conversation-detail.contract";
import { MemberContract } from "src/domain/conversations/contracts/member.contract";
import { UserInConversationAdapter } from "../adapter/user-in-conversation.adapter";
import { UserInConversation } from "src/domain/conversations/entities/user-in-conversation.entity";
import { User } from "src/domain/users/users";
import { UserOrm } from "src/infrastructure/relational-database/orm/user.orm";
import { UserAdapter } from "../adapter/user.adapter";

@Injectable()
export class ConversationRepository implements IConversationRepository {
  constructor(
    @InjectRepository(ConversationOrm)
    private readonly conversationRepository: Repository<ConversationOrm>,
    @InjectRepository(UserInConversationOrm)
    private readonly userInConversationRepository: Repository<UserInConversationOrm>,
    @Inject(UserAdapter)
    private readonly userAdapter: IAdapter<User, UserOrm>,
    @Inject(ConversationAdapter)
    private readonly conversationAdapter: IAdapter<Conversation, ConversationOrm>,
    @Inject(UserInConversationAdapter)
    private readonly userInConversationAdapter: IAdapter<UserInConversation, UserInConversationOrm>,
  ){}

  async findWithCursorPagination(userId: UUID, limit: number, cursor: TCursor, direction: Direction = Direction.PREV): Promise<ConversationPaginationContract> {
    const qb = this.conversationRepository.createQueryBuilder('conversation').where(
      qb => {
      const subQuery = this.queryToFindConversationIdsOfUser(qb, userId);
      return 'conversation.id IN ' + subQuery;
    });
    
    const result = await cursorPaginate(qb, limit, cursor, qb.alias, 'updatedAt', direction);
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
    return conversationOrm ? this.conversationAdapter.toEntity(conversationOrm) : null;
  }

  async findMembers(conversationId: UUID): Promise<MemberContract[]> {
    const result = await this.userInConversationRepository.createQueryBuilder('uic')
      .leftJoinAndSelect('uic.user', 'user')
      .where('uic.conversationId = :conversationId', { conversationId })
      .getMany();
    return result.map(orm => new MemberContract(this.userInConversationAdapter.toEntity(orm), this.userAdapter.toEntity(orm.user)));
  }

  async findTopMembers(conversationId: UUID, limit: number): Promise<MemberContract[]> {
    const uicOrms = await this.userInConversationRepository.createQueryBuilder('uic')
      .leftJoinAndSelect('uic.user', 'user')
      .where('uic.conversationId = :conversationId', { conversationId })
      .limit(limit)
      .orderBy('user.createdAt', 'DESC')
      .getMany(); 
    const members = uicOrms.map(orm => new MemberContract(this.userInConversationAdapter.toEntity(orm), this.userAdapter.toEntity(orm.user)));
    return members;
  }

  async countMembers(conversationId: UUID): Promise<number> {
    const count = await this.userInConversationRepository.createQueryBuilder('uic')
      .where('uic.conversationId = :conversationId', { conversationId })
      .getCount();
    return count;
  }

  async save(conversation: Conversation): Promise<Conversation> {
    const conversationOrm = this.conversationAdapter.toOrm(conversation);
    await this.conversationRepository.save(conversationOrm);
    return this.conversationAdapter.toEntity(conversationOrm);
  }

  async findByIdDetails(id: UUID): Promise<ConversationDetailContract> {
    const conversationOrm = await this.conversationRepository.findOne({ 
      where: { id },
      relations: ['owner', 'userInConversations']
    });
    if(!conversationOrm)
      return null;
    const conversation = this.conversationAdapter.toEntity(conversationOrm);
    const owner = new MemberContract(
      this.userInConversationAdapter.toEntity(conversationOrm.userInConversations.find(uic => uic.userId === conversation.owner)), 
      this.userAdapter.toEntity(conversationOrm.owner)
    );
    
    return new ConversationDetailContract(
      conversation, 
      owner
    );
  }

  async findAllMember(conversationId: UUID): Promise<MemberContract[]> {
    const uicOrms = await this.userInConversationRepository.createQueryBuilder('uic')
      .leftJoinAndSelect('uic.user', 'user')
      .where('uic.conversationId = :conversationId', { conversationId })
      .getMany(); 
    const members = uicOrms.map(orm => new MemberContract(this.userInConversationAdapter.toEntity(orm), this.userAdapter.toEntity(orm.user)));
    return members;
  }

   async findById(id: UUID): Promise<Conversation> {
    const conversationOrm = await this.conversationRepository.findOne({ 
      where: { id },
      relations: ['userInConversations']
    });
    return conversationOrm ? this.conversationAdapter.toEntity(conversationOrm) : null;
  }

  async findByUserId(userId: UUID): Promise<Conversation[]> {
    const userInConversations = await this.findAllConversationsOfUser(userId);
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

  private async findAllConversationsOfUser(userId: UUID): Promise<UserInConversation[]> {
    const userInConversationOrms = await this.userInConversationRepository.find({
      where: { userId },
    });
    return userInConversationOrms.map(orm => this.userInConversationAdapter.toEntity(orm));
  }

  private queryToFindConversationIdsOfUser(qb: SelectQueryBuilder<ConversationOrm>, userId: UUID){
    return qb.subQuery()
      .select('uic.conversationId')
      .from(UserInConversationOrm, 'uic')
      .where('uic.userId = :userId', { userId })
      .getQuery();
  }
}