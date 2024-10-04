import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';

import { RedisConfig } from './redis.config';
import { RedisConnectionName } from '../enums';

export class RedisGroupConfig implements Record<RedisConnectionName, RedisConfig> {
  @Type(() => RedisConfig)
  @IsDefined()
  @ValidateNested()
  public readonly default!: RedisConfig;
}
