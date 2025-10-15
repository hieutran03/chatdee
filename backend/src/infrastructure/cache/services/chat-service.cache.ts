import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UUID } from 'crypto';
import Redis from 'ioredis';
import { IChatServiceCache } from 'src/application/chats/cache/chat-service-cache.interface';
import { ObjectPatternEnum } from 'src/shared/common/enums/object-pattern.enum';
import {
  ChatPatternUtil,
  getObjectIdFromPattern
} from 'src/shared/core/utils/pattern.util';
import { deleteByPattern } from 'src/shared/core/utils/redis.util';

@Injectable()
export class ChatServiceCache implements IChatServiceCache, OnModuleInit {
  private redis: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }

  onModuleInit() {
    deleteByPattern(this.redis, `${ChatPatternUtil.chatPrefix}:*`);
  }

  async addSocketIdToMember(
    conversationId: UUID,
    userId: UUID,
    socketId: string,
  ): Promise<void> {
    const memberKey = ChatPatternUtil.getMemberPattern(conversationId, userId);
    const socketKey = ChatPatternUtil.getSocketPattern(socketId);
    await this.redis.sadd(memberKey, socketKey);
    await this.redis.sadd(socketKey, memberKey);
  }

  private async getAllSocketKeysOfMember(conversationId: UUID, userId: UUID): Promise<string[]> {
    const memberKey = ChatPatternUtil.getMemberPattern(conversationId, userId);
    const socketKeys = await this.redis.smembers(memberKey);
    return socketKeys;
  }

  async removeMemberAndGetSocketIds(conversationId: UUID, userId: UUID): Promise<string[]> {
    const memberKey = ChatPatternUtil.getMemberPattern(conversationId, userId);
    const socketKeys = await this.getAllSocketKeysOfMember(conversationId, userId) ?? [];
    if (socketKeys.length === 0) {
      await this.redis.del(memberKey);
      return [];
    }
    const pipeline = this.redis.pipeline();
    pipeline.del(memberKey);
    for (const socketKey of socketKeys) {
      pipeline.srem(socketKey, memberKey);
    }
    await pipeline.exec();
    const socketIds = socketKeys.map((key)=> getObjectIdFromPattern(key, ObjectPatternEnum.socket));
    return socketIds;
  }

  async deleteSocketId(socketId: string): Promise<void> {
    const socketKey = ChatPatternUtil.getSocketPattern(socketId);
    const memberKeys = await this.redis.smembers(socketKey);
    console.log('memberKeys', memberKeys);
    if (memberKeys.length === 0) {
      await this.redis.del(socketKey);
      return;
    }
    const pipeline = this.redis.pipeline();
    pipeline.del(socketKey);
    for (const memberKey of memberKeys) {
      pipeline.srem(memberKey, socketKey);
    }
    await pipeline.exec();
  }
}
