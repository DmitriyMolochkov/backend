import { RegisterQueueOptions } from '@nestjs/bullmq';
import {
  DefaultJobOptions,
  Job,
  JobsOptions,
  Queue,
  Worker,
} from 'bullmq';
import { WorkerListener } from 'bullmq/dist/esm/classes/worker';

export interface IBullJobRemoveOptions {
  removeOnComplete?: DefaultJobOptions['removeOnComplete'];
  removeOnFail?: DefaultJobOptions['removeOnFail'];
}

export interface IBullRepeatableJobOptions extends IBullJobRemoveOptions {
  readonly backoff?: DefaultJobOptions['backoff'];
  readonly attempts?: DefaultJobOptions['attempts'];
  readonly repeat: Exclude<JobsOptions['repeat'], undefined>;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export interface IQueueDefinition<
  JobType = string, /* eslint-disable unused-imports/no-unused-vars  */
  Data = unknown,
  ReturnType = unknown, /*  eslint-enable unused-imports/no-unused-vars */
>
  extends Omit<RegisterQueueOptions, 'name'> {
  name: JobType;
}

export interface IRepeatableQueueDefinition<JobType extends string, ReturnType = unknown>
  extends IQueueDefinition<JobType, undefined, ReturnType> {}

export type JobData<Q extends IQueueDefinition> = Q extends IQueueDefinition<string, infer Data>
  ? Data
  : never;

export type JobReturnType<Q extends IQueueDefinition> = Q extends IQueueDefinition<
    string,
    unknown,
    infer ReturnType
  >
  ? ReturnType
  : never;

export type TypedQueue<Q extends IQueueDefinition> = Queue<JobData<Q>, JobReturnType<Q>>;

export type TypedWorker<Q extends IQueueDefinition> = Worker<JobData<Q>, JobReturnType<Q>>;

export type TypedWorkerListener<Q extends IQueueDefinition> =
  WorkerListener<JobData<Q>, JobReturnType<Q>>;

export type TypedJob<Q extends IQueueDefinition> = Job<JobData<Q>, JobReturnType<Q>>;
