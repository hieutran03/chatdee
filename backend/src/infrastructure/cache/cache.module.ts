import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { providers } from './cache.provider';
@Module({
  imports: [
    RedisModule.forRoot(
      {
        readyLog: true,
        closeClient: true,
        config: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT, 10),
          password: process.env.REDIS_PASSWORD,
          // db: 0,
        }
      }
    ),
  ],
  providers: [
    ...providers
  ],
  exports: [
    ...providers
  ],
})
export class CacheModule {}