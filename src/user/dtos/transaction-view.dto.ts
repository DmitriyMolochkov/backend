import { CoinType } from '../../balance-change/enums';

export class TransactionViewDto {
  public readonly type: string;
  public readonly hash: string;
  public readonly coin: CoinType;
  public readonly amount: number;
  public readonly createdAt: Date;

  public constructor(entity: TransactionViewDto) {
    this.type = entity.type;
    this.hash = entity.hash;
    this.coin = entity.coin;
    this.amount = entity.amount;
    this.createdAt = entity.createdAt;
  }
}
