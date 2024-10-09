import { BalanceChangeEntity } from './entities';

export type BalanceChangeCreateInfo = Pick<
  BalanceChangeEntity,
  'walletAddress' | 'changeAmount' | 'coinType' | 'changeSource' | 'txnHash' | 'description'
>;
