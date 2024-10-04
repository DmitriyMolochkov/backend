import { Provider } from '@nestjs/common';
import { RedisOptions } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

import { RedisConnectionName, RedisGroupConfig } from 'infrastructure/config';

import RedisClient from './redis.client';
import { getRedisToken } from './utils';

export function createRedisProviders(
  optionsArray: (RedisOptions & { connectionName: RedisConnectionName })[],
): Provider[] {
  return (optionsArray || []).map(({ connectionName, ...options }) => ({
    provide: getRedisToken(connectionName),
    useFactory: async (
      redisGroupConfig: RedisGroupConfig,
      logger: PinoLogger,
    ) => {
      const redisConfig = redisGroupConfig[connectionName];
      const redis = new RedisClient(
        connectionName,
        {
          lazyConnect: true,
          ...options,
          host: redisConfig.host,
          port: redisConfig.port,
        },
        logger,
      );

      await redis.connect();

      return redis;
    },
    inject: [RedisGroupConfig, PinoLogger],
  }));
}
