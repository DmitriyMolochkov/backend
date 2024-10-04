import { Config } from './config';
import { Environment, LogLevel, RedisConnectionName } from './enums';

export const plainConfig: Config = {
  configEnv: process.env.CONFIG_ENV as Environment,
  sessionKey: process.env.SESSION_SECRET_KEY,
  pg: {
    writeConnectionString: process.env.PG_WRITE_CONNECTION_STRING,
    readConnectionString: process.env.PG_READ_CONNECTION_STRING,
    connectionTimeout: Number(process.env.PG_CONNECTION_TIMEOUT ?? '60000'),
    poolSize: Number(process.env.PG_POOL_SIZE ?? '10'),
  },
  http: {
    port: Number(process.env.HTTP_PORT ?? '8080'),
    host: process.env.HTTP_HOST ?? '0.0.0.0',
    swaggerServer: process.env.SWAGGER_SERVER ?? '/',
    defaultClientTimeout: Number(process.env.HTTP_DEFAULT_CLIENT_TIMEOUT ?? '60000'),
  },
  bullBoard: {
    username: process.env.BULL_BOARD_USERNAME ?? 'bull',
    password: process.env.BULL_BOARD_PASSWORD ?? 'bull',
  },
  logger: {
    level: (process.env.LOG_LEVEL ?? LogLevel.info) as LogLevel,
  },
  redisGroups: {
    [RedisConnectionName.default]: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? '6379'),
    },
  },
};
