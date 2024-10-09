import { Injectable } from '@nestjs/common';
import Web3 from 'web3';

import { BalanceChangeEntity } from '../../balance-change/entities';
import { TransactionViewDto } from '../dtos';

const web3 = new Web3();

@Injectable()
export class BalanceChangeMapper {
  public mapToTransactionView(
    ormEntity: BalanceChangeEntity,
  ): TransactionViewDto {
    return new TransactionViewDto({
      type: ormEntity.changeAmount > 0 ? 'deposit' : 'withdraw',
      hash: ormEntity.txnHash,
      coin: ormEntity.coinType,
      amount: Number(web3.utils.fromWei(ormEntity.changeAmount, 'ether')),
      createdAt: ormEntity.createdAt,
    });
  }
}
