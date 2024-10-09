import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BigIntTransformer } from '../../common/utils';
import { BalanceChangeSource, CoinType } from '../enums';

@Entity({ name: 'balance_changes' })
export default class BalanceChangeEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    name: 'wallet_address',
    type: 'varchar',
  })
  public walletAddress!: string;

  @Column({
    name: 'coin_type',
    type: 'varchar',
  })
  public coinType!: CoinType;

  @Column({
    name: 'change_amount',
    type: 'bigint',
    transformer: BigIntTransformer,
  })
  public changeAmount!: bigint;

  @Column({
    name: 'change_source',
    type: 'varchar',
  })
  public changeSource!: BalanceChangeSource;

  @Column({
    name: 'txn_hash',
    type: 'varchar',
    nullable: true,
  })
  public txnHash!: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public description!: string | null;

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
