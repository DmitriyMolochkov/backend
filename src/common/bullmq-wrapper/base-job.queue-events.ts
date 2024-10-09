import { OnQueueEvent } from '@nestjs/bullmq';
import { QueueEventsHost } from '@nestjs/bullmq/dist/hosts/queue-events-host.class';
import { OnApplicationBootstrap } from '@nestjs/common';
import { QueueEventsListener } from 'bullmq/dist/esm/classes/queue-events';
import { PinoLogger } from 'nestjs-pino';

import { errorToObject } from './utils';

export abstract class BaseJobQueueEvents extends QueueEventsHost implements OnApplicationBootstrap {
  protected abstract logger: PinoLogger;
  protected abstract type: string;

  public async onApplicationBootstrap() {
    this.queueEvents
      .run()
      .catch((error) => {
        this.logger.fatal(
          {
            type: this.type,
            error: errorToObject(error),
          },
          'Fatal error in job queue events',
        );
      });
  }
    
  @OnQueueEvent('added')
  protected onAdded(...[{ jobId, name }]: Parameters<QueueEventsListener['added']>) {
    this.logger.info(
      {
        type: this.type,
        id: jobId,
        name,
      },
      'Job added in queue',
    );
  }

  @OnQueueEvent('duplicated')
  protected onDuplicated(...[{ jobId }]: Parameters<QueueEventsListener['duplicated']>) {
    this.logger.warn(
      {
        type: this.type,
        id: jobId,
      },
      'Job duplicated',
    );
  }

  @OnQueueEvent('stalled')
  protected onStalled(...[{ jobId }]: Parameters<QueueEventsListener['stalled']>) {
    this.logger.warn(
      {
        type: this.type,
        id: jobId,
      },
      'Job stalled',
    );
  }

  @OnQueueEvent('error')
  protected onError(...[error]: Parameters<QueueEventsListener['error']>) {
    this.logger.error(
      {
        type: this.type,
        error: errorToObject(error),
      },
      'Error in job queue events',
    );
  }
}
