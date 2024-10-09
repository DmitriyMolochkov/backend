import {
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BigIntTransformer } from '../../common/utils';

@Entity({ name: 'processed_blocks' })
export default class ProcessedBlockEntity {
  @PrimaryColumn({
    name: 'block_number',
    type: 'bigint',
    transformer: BigIntTransformer,
  })
  public blockNumber!: bigint;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  public createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  public updatedAt!: Date;
}
