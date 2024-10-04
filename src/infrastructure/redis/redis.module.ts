import { DynamicModule, Module } from '@nestjs/common';
import { RedisOptions } from 'bullmq';

import { RedisConnectionName } from 'infrastructure/config';

import { createRedisProviders } from './redis.providers';

@Module({})
export class RedisModule {
  public static forRoot(
    optionsArray: (RedisOptions & { connectionName: RedisConnectionName })[],
  ): DynamicModule {
    const providers = createRedisProviders(optionsArray);

    return {
      global: true,
      module: RedisModule,
      providers,
      exports: providers,
    };
  }
}
