import { RedisConnectionName } from 'infrastructure/config';

export function getRedisToken(connectionName: RedisConnectionName) {
  return Symbol.for(`${connectionName}_RedisClient`);
}
