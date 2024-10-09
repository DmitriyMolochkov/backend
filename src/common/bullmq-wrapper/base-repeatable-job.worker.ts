import { BaseJobWorker } from './base-job.worker';
import { IBullRepeatableJobOptions, IQueueDefinition, JobReturnType } from './bullmq.interfaces';
import { errorToObject } from './utils';

export abstract class BaseRepeatableJobWorker<Q extends IQueueDefinition<string, undefined>>
  extends BaseJobWorker<IQueueDefinition<string, undefined, JobReturnType<Q>>> {
  protected readonly abstract jobOptions: IBullRepeatableJobOptions;

  public async onApplicationBootstrap() {
    const existJobs = await this.queue.getRepeatableJobs();

    try {
      const pattern = this.jobOptions.repeat.pattern ?? this.jobOptions.repeat.every;
      const jobsToRemove = existJobs.filter((job) => job.pattern !== pattern);
      await Promise.all(jobsToRemove.map((job) => this.queue.removeRepeatableByKey(job.key)));

      await this.queue.add(
        'job',
        undefined,
        this.jobOptions,
      );
    } catch (error) {
      this.logger.error(
        {
          type: this.type,
          error: errorToObject(error),
        },
        'Cannot add repeatable job',
      );
    }

    await super.onApplicationBootstrap();
  }
}
