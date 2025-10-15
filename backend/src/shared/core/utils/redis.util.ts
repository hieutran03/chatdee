import Redis from 'ioredis';

export const deleteByPattern = (redis: Redis, pattern: string) => {
  const stream = redis.scanStream({
    match: pattern,
    count: 100, // số lượng key mỗi batch
  });

  const pipeline = redis.pipeline();

  stream.on('data', (keys: string[]) => {
    if (keys.length) {
      keys.forEach((key) => pipeline.del(key));
    }
  });

  return new Promise<void>((resolve, reject) => {
    stream.on('end', async () => {
      await pipeline.exec();
      resolve();
    });
    stream.on('error', reject);
  });
}