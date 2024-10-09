import { TransactionInfo } from 'web3-types/src/eth_types';

import { createQueue } from 'common/bullmq-wrapper';

import { BalanceChangeEntity } from '../../balance-change/entities';
import { EthereumContractJobNameEnum } from '../enums';

type JobData = {
  transaction: {
    hash: string;
    blockHash?: string;
    blockNumber: number;
    from: TransactionInfo['from'];
    to: string;
    transactionIndex?: string;
    value?: string;
    type?: string;
    chainId?: string;
    input?: string;
  };
};

type ReturnType = {
  balanceChange: Omit<BalanceChangeEntity, 'changeAmount'> & { changeAmount: string } | null;
};

export const HandleTransactionQueue = createQueue<
  EthereumContractJobNameEnum.handleTransaction,
  JobData,
  ReturnType
>(
  EthereumContractJobNameEnum.handleTransaction,
);
