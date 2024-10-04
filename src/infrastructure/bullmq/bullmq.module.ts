import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { RedisConnectionName, RedisGroupConfig } from 'infrastructure/config';
import { PackageJson } from 'infrastructure/package-json';

import { BullBoardAuthMiddleware, BullBoardAuthModule } from './auth';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [
        RedisGroupConfig,
        PackageJson,
      ],
      useFactory: (redisGroupConfig: RedisGroupConfig, packageJson: PackageJson) => {
        const redisConfig = redisGroupConfig[RedisConnectionName.default];

        return ({
          connection: {
            host: redisConfig.host,
            port: redisConfig.port,
          },
          prefix: `${packageJson.name}:job-queue`,
        });
      },
    }),
    BullBoardModule.forRoot({
      route: '/bull/queues',
      adapter: ExpressAdapter,
      middleware: BullBoardAuthMiddleware,
    }),
    BullBoardAuthModule,
  ],
})
export class BullMQModule {}
