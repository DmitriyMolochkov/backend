import { OnApplicationShutdown } from '@nestjs/common';
import { RedisOptions } from 'bullmq';
import { Redis } from 'ioredis';
import { PinoLogger } from 'nestjs-pino';

import { RedisConnectionName } from 'infrastructure/config';

export default class RedisClient extends Redis implements OnApplicationShutdown {
  public constructor(
    public connectionName: RedisConnectionName,
    options: RedisOptions,
    protected logger: PinoLogger,
  ) {
    super(options);
    this.logger.setContext(`${this.constructor.name}:${connectionName}`);

    this.subscribeOnEvents();
  }

  public get isReady() {
    return this.status === 'ready';
  }

  public async onApplicationShutdown() {
    if (this.isReady) {
      await this.quit();
    }
  }

  private subscribeOnEvents() {
    this.on('error', (error) => this.logger.error(error, 'Redis failed to connect'));
    this.on('connect', () => this.logger.info('Connected to redis'));
    this.on('reconnecting', (ms: number) => this.logger.warn(`Reconnecting to redis in ${ms}`));
    this.on('close', () => this.logger.warn('Connection to redis has closed'));
    this.on('end', () => {
      this.logger.warn('Connection to redis has closed and no more reconnects will be done');
    });
  }
}
