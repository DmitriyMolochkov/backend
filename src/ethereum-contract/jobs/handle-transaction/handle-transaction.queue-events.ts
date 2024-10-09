import { QueueEventsListener } from '@nestjs/bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { BaseJobQueueEvents, buildQueueEventOptions } from 'common/bullmq-wrapper';

import { HandleTransactionQueue } from '../handle-transaction.queue';

@QueueEventsListener(HandleTransactionQueue.name, buildQueueEventOptions())
export class HandleTransactionQueueEvents extends BaseJobQueueEvents {
  protected readonly type = HandleTransactionQueue.name;

  public constructor(
    @InjectPinoLogger(HandleTransactionQueueEvents.name) protected readonly logger: PinoLogger,
  ) {
    super();
  }
}
