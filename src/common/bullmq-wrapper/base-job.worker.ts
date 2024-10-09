import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { OnApplicationBootstrap } from '@nestjs/common';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

import {
  IQueueDefinition,
  JobData,
  JobReturnType,
  TypedJob,
  TypedQueue,
  TypedWorker,
  TypedWorkerListener,
} from './bullmq.interfaces';
import { buildLogData, errorToObject } from './utils';

export abstract class BaseJobWorker<Q extends IQueueDefinition>
  extends WorkerHost<TypedWorker<Q>>
  implements OnApplicationBootstrap {
  protected readonly abstract type: string;
  protected readonly abstract haveSensitiveData: boolean;

  public constructor(
    protected readonly logger: PinoLogger,
    protected readonly queue: TypedQueue<Q>,
  ) {
    super();
    this.onQueueEvents();
  }

  public async onApplicationBootstrap() {
    if (!this.worker.isRunning()) {
      this.worker
        .run()
        .catch((error) => {
          this.logger.fatal(
            {
              type: this.type,
              error: errorToObject(error),
            },
            'Fatal error in job queue',
          );
        });
    }
  }

  protected onQueueEvents() {
    this.queue.on('removed', (job) => {
      this.logger.info(
        {
          type: this.type,
          name: job.name,
          id: job.id,
          payload: buildLogData(job.data, this.haveSensitiveData),
        },
        'Job removed from queue',
      );
    });

    this.queue.on('error', (error) => {
      this.logger.error(
        {
          type: this.type,
          error: {
            message: error.message,
            stack: error.stack,
          },
        },
        'Error in job queue',
      );
    });
  }

  @OnWorkerEvent('active')
  protected onActive(...[job]: Parameters<TypedWorkerListener<Q>['active']>) {
    this.logger.info(
      {
        type: this.type,
        name: job.name,
        id: job.id,
        payload: buildLogData(job.data, this.haveSensitiveData),
      },
      'Job is active',
    );
  }

  @OnWorkerEvent('completed')
  protected async onCompleted(
    ...[job, result]: Parameters<TypedWorkerListener<Q>['completed']>
  ) {
    this.logger.info(
      {
        type: this.type,
        name: job.name,
        id: job.id,
        payload: buildLogData(job.data, this.haveSensitiveData),
        result: buildLogData(result, this.haveSensitiveData),
      },
      'Job completed',
    );

    try {
      await this.completeHandler(job, result);
    } catch (handlerError) {
      this.logger.error(
        {
          type: this.type,
          name: job.name,
          id: job.id,
          payload: buildLogData(job.data, this.haveSensitiveData),
          result: buildLogData(result, this.haveSensitiveData),
          error: errorToObject(handlerError),
        },
        'Cannot run complete handler for completed job',
      );
    }
  }

  @OnWorkerEvent('failed')
  protected async onFailed(
    ...[job, error]: Parameters<TypedWorkerListener<Q>['failed']>
  ) {
    this.logger.error(
      {
        type: this.type,
        name: job?.name,
        id: job?.id,
        payload: buildLogData(job?.data, this.haveSensitiveData),
        error: errorToObject(error),
      },
      'Cannot execute job',
    );

    if (job) {
      try {
        await this.errorHandler(job, error);
      } catch (handlerError) {
        this.logger.error(
          {
            type: this.type,
            name: job.name,
            id: job.id,
            payload: buildLogData(job.data, this.haveSensitiveData),
            error: errorToObject(handlerError),
          },
          'Cannot run error handler for job failure',
        );
      }
    }
  }

  @OnWorkerEvent('error')
  protected onError(...[failedReason]: Parameters<TypedWorkerListener<Q>['error']>) {
    this.logger.error(
      {
        type: this.type,
        error: errorToObject(failedReason),
      },
      'Error in job worker',
    );
  }

  public abstract process(job: TypedJob<Q>, token?: string): Promise<JobReturnType<Q>>;

  protected async completeHandler(
    _job: Job<JobData<Q>, JobReturnType<Q>>,
    _result: JobReturnType<Q>,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ): Promise<void> {
  }

  protected async errorHandler(
    _job: TypedJob<Q>,
    _error: Error,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ): Promise<void> {
  }
}
