import { InjectQueue, Processor } from '@nestjs/bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { BaseJobWorker, TypedQueue, buildWorkerOptions } from 'common/bullmq-wrapper';

import { BalanceChangeService } from '../../../balance-change/balance-change.service';
import { BalanceChangeEntity } from '../../../balance-change/entities';
import { BalanceChangeSource, CoinType } from '../../../balance-change/enums';
import { buildLogMsg } from '../../../common/utils';
import { EthereumContractService } from '../../ethereum-contract.service';
import { HandleTransactionQueue } from '../handle-transaction.queue';

@Processor(HandleTransactionQueue.name, buildWorkerOptions())
export class HandleTransactionWorker extends BaseJobWorker<typeof HandleTransactionQueue> {
  protected readonly haveSensitiveData = false;

  protected readonly type = HandleTransactionQueue.name;

  public constructor(
    @InjectPinoLogger(HandleTransactionWorker.name) protected readonly logger: PinoLogger,
    @InjectQueue(HandleTransactionQueue.name) queue: TypedQueue<typeof HandleTransactionQueue>,
    private readonly contractService: EthereumContractService,
    private readonly balanceChangeService: BalanceChangeService,

  ) {
    super(logger, queue);
  }

  public async process(
    ...[job]: Parameters<(BaseJobWorker<typeof HandleTransactionQueue>['process'])>
  ) {
    const { transaction: transactionInfo } = job.data;
    const transaction = await this.contractService.requestTransactionByHash(transactionInfo.hash);
    const contractMethod = this.contractService.getContractMethod(transaction);

    let balanceChange: BalanceChangeEntity | null = null;

    if (contractMethod === 'deposit') {
      balanceChange = await this.balanceChangeService.addBalanceChangeRecord({
        walletAddress: transactionInfo.from.toLowerCase(),
        changeAmount: BigInt(transactionInfo.value ?? 0),
        coinType: CoinType.eth,
        changeSource: BalanceChangeSource.blockchainTransaction,
        txnHash: transactionInfo.hash,
        description: null,
      });
    }

    if (contractMethod === 'withdraw') {
      // TODO implement
    }

    await job.log(
      buildLogMsg(`Transaction was successfully processed using the '${contractMethod}' method`),
    );

    if (balanceChange) {
      const { changeAmount, ...restFields } = balanceChange;

      return { balanceChange: { ...restFields, changeAmount: changeAmount.toString() } };
    }

    return { balanceChange };
  }
}
