import { Inject } from '@nestjs/common';

import { RedisConnectionName } from 'infrastructure/config';

import { getRedisToken } from './utils';

export function InjectRedis(connectionName: RedisConnectionName) {
  return Inject(getRedisToken(connectionName));
}
