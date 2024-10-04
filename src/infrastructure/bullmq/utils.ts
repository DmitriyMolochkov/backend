import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule, BullBoardQueueOptions } from '@bull-board/nestjs';
import { createQueue } from '@kokos/nestjs-bullmq-wrapper';
import { BullModule } from '@nestjs/bullmq';

export function registerBullQueue(...queues: ReturnType<typeof createQueue>[]) {
  return [
    BullModule.registerQueue(...queues),
    BullBoardModule.forFeature(
      ...queues.map(
        (q): BullBoardQueueOptions => ({
          name: q.name,
          adapter: BullMQAdapter,
        }),
      ),
    ),
  ];
}
