import { RedisService } from "@liaoliaots/nestjs-redis";
import { Inject } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { UUID } from "crypto";
import Redis from "ioredis";
import { IConversationRepositoryCache } from "src/application/conversations/cache/conversation-repository-cache.interface";
import { ConversationDetailContract } from "src/domain/conversations/contracts/conversation-detail.contract";
import { ConversationPaginationContract } from "src/domain/conversations/contracts/conversation-pagination.contract";
import { MemberContract } from "src/domain/conversations/contracts/member.contract";
import { Conversation } from "src/domain/conversations/conversation";
import { UserInConversation } from "src/domain/conversations/entities/user-in-conversation.entity";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { IUserRepository, IUserRepositoryToken } from "src/domain/users/repositories/user-repository.interface";
import { Direction } from "src/shared/common/enums/direction.enum";
import { TCursor } from "src/shared/common/types/cursor.type";
import { ConversationPatternUtil } from "src/shared/core/utils/pattern.util";

export class ConversationRepositoryCache implements IConversationRepositoryCache {
  private redis: Redis;
  constructor(
    @Inject(IConversationRepositoryToken)
    private readonly conversationRepository: IConversationRepository,
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    private readonly redisService: RedisService
  ) {
    this.redis = this.redisService.getOrThrow();
  }
  
  findWithCursorPagination(userId: UUID, limit: number, cursor: TCursor, direction?: Direction): Promise<ConversationPaginationContract> {
    return this.conversationRepository.findWithCursorPagination(userId, limit, cursor, direction);
  }
  
  save(conversation: Conversation): Promise<Conversation> {
    return this.conversationRepository.save(conversation);
  }
  
  findById(id: UUID): Promise<Conversation> {
    return this.conversationRepository.findById(id);
  }
  
  findByIdDetails(id: UUID): Promise<ConversationDetailContract> {
    return this.conversationRepository.findByIdDetails(id);
  }
  
  async findMembers(conversationId: UUID): Promise<MemberContract[]> {
    const conversationKey = ConversationPatternUtil.getConversationPattern(conversationId);
    const membersCache = await this.redis.smembers(conversationKey);
    if(membersCache.length === 0){
      const members = await this.conversationRepository.findMembers(conversationId);
      const pipeline = this.redis.pipeline();
      pipeline.sadd(
        conversationKey, 
        ...members.map((member)=>JSON.stringify(member))
      );
      pipeline.expire(conversationKey, 3600*24);
      await pipeline.exec();
      return members;
    }
    return membersCache.map((member) => plainToInstance(MemberContract, JSON.parse(member)));
  }
  
  findTopMembers(conversationId: UUID, limit: number): Promise<MemberContract[]> {
    return this.conversationRepository.findTopMembers(conversationId, limit);
  }
  
  findDirectConversation(firstUserId: string, secondUserId: string): Promise<Conversation> {
    return this.conversationRepository.findDirectConversation(firstUserId, secondUserId);
  }
  
  countMembers(conversationId: UUID): Promise<number> {
    return this.conversationRepository.countMembers(conversationId);
  }

  async addMember(userId: UUID, conversationId: UUID): Promise<void> {
    const member = UserInConversation.create(conversationId, userId);
    const conversationKey = ConversationPatternUtil.getConversationPattern(member.conversationId);
    const user = await this.userRepository.findById(member.userId);
    this.redis.sadd(conversationKey, JSON.stringify(new MemberContract(member, user)));
  }

  async removeMember(userId: UUID, conversationId: UUID): Promise<void> {
    const member = UserInConversation.create(conversationId, userId);
    const conversationKey = ConversationPatternUtil.getConversationPattern(member.conversationId);
    const user = await this.userRepository.findById(member.userId);
    this.redis.srem(conversationKey, JSON.stringify(new MemberContract(member, user)));
  }

  async updateMember(userId: UUID, conversationId: UUID): Promise<void> {
    const member = UserInConversation.create(conversationId, userId);
    const conversationKey = ConversationPatternUtil.getConversationPattern(member.conversationId);
    const user = await this.userRepository.findById(member.userId);
    const pipeline = this.redis.pipeline();
    pipeline.srem(conversationKey, JSON.stringify(new MemberContract(member, user))); //-> Maybe wrong if not same object reference
    pipeline.sadd(conversationKey, JSON.stringify(new MemberContract(member, user)));
    await pipeline.exec();
  }
  
  findByUserId(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.findByUserId(userId);
  }
  
  update(id: UUID, conversation: Conversation): Promise<void> {
    return this.conversationRepository.update(id, conversation);
  }
  
  delete(id: UUID): Promise<void> {
    return this.conversationRepository.delete(id);
  }
  
}