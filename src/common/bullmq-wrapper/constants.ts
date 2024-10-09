import { JobType } from 'bullmq';

export const notFinishedJobTypes = [
  'active',
  'delayed',
  'prioritized',
  'waiting',
  'waiting-children',
  'paused',
  'repeat',
  'wait',
] satisfies JobType[];
