import path from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PgConfig } from 'infrastructure/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [PgConfig],
      useFactory: (config: PgConfig) => ({
        type: 'postgres',
        entities: [path.join(__dirname, '..', '..', '**', 'entities', '*.entity{.ts,.js}')],
        logging: 'all',
        logger: 'debug',
        extra: {
          max: config.poolSize,
        },
        replication: {
          master: {
            url: config.writeConnectionString,
          },
          slaves: [
            {
              url: config.readConnectionString,
            },
          ],
        },
        connectTimeoutMS: config.connectionTimeout,
      }),
    }),
  ],
})
export class PostgresModule {}
