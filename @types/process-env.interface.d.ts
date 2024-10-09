import { Options } from 'pino-http';

declare interface ProcessEnv extends Dict<string> {
  // common
  CONFIG_ENV: string;
  SESSION_SECRET_KEY: string;
  NODE_TLS_REJECT_UNAUTHORIZED: string;

  // postgres
  PG_WRITE_CONNECTION_STRING: string;
  PG_READ_CONNECTION_STRING: string;
  PG_CONNECTION_TIMEOUT: string | undefined;
  PG_POOL_SIZE: string | undefined;

  // http
  HTTP_PORT: string | undefined;
  HTTP_HOST: string | undefined;
  SWAGGER_SERVER: string | undefined;
  HTTP_DEFAULT_CLIENT_TIMEOUT: string | undefined;

  // bull-board
  BULL_BOARD_USERNAME: string | undefined;
  BULL_BOARD_PASSWORD: string | undefined;

  // logger
  LOG_LEVEL: Options['useLevel'];

  // redis
  REDIS_HOST: string | undefined;
  REDIS_PORT: string | undefined;

  // typeorm
  TYPEORM_MIGRATIONS_TRANSACTION_MODE: 'all' | 'each' | undefined;

  // ethereum contract
  ETHEREUM_CONTRACT_NOSE_WSS_URL: string;
  ETHEREUM_CONTRACT_ADDRESS: string;
  ETHEREUM_CONTRACT_OWNER_WALLET: string | undefined;
  ETHEREUM_CONTRACT_OWNER_PRIVATE_KEY: string | undefined;
  ETHEREUM_CONTRACT_START_BLOCK_NUMBER: string;
}
