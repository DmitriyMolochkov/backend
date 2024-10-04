import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Environment } from './enums';
import {
  BullBoardConfig,
  HttpConfig,
  LoggerConfig,
  PgConfig,
  RedisGroupConfig,
} from './parts';

export class Config {
  @IsEnum(Environment)
  public readonly configEnv!: Environment;

  @IsDefined()
  @IsString()
  public readonly sessionKey!: string;

  @Type(() => PgConfig)
  @IsDefined()
  @ValidateNested()
  public readonly pg!: PgConfig;

  @Type(() => HttpConfig)
  @IsDefined()
  @ValidateNested()
  public readonly http!: HttpConfig;

  @Type(() => LoggerConfig)
  @IsDefined()
  @ValidateNested()
  public readonly logger!: LoggerConfig;

  @Type(() => RedisGroupConfig)
  @IsDefined()
  @ValidateNested()
  public readonly redisGroups!: RedisGroupConfig;

  @Type(() => BullBoardConfig)
  @IsDefined()
  @ValidateNested()
  public readonly bullBoard!: BullBoardConfig;
}
