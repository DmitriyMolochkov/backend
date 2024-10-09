import { TypedQueue } from '@kokos/nestjs-bullmq-wrapper';
import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import pAll from 'p-all';
import { IsNull, Not, Repository } from 'typeorm';
import Web3 from 'web3';
import { TransactionInfo } from 'web3-types/src/eth_types';

import { ProcessedBlockEntity } from './entities';
import { WEB_3_TOKEN } from './ethereum-contract.constants';
import { HandleTransactionQueue } from './jobs/handle-transaction.queue';
import { EthereumContractConfig } from '../infrastructure/config';

@Injectable()
export class ContractListenerService implements OnModuleInit {
  public constructor(
    @InjectPinoLogger(ContractListenerService.name) private readonly logger: PinoLogger,
    @Inject(WEB_3_TOKEN) private readonly web3: Web3,
    private readonly contractConfig: EthereumContractConfig,
    @InjectRepository(ProcessedBlockEntity)
    private readonly processedBlockRepository: Repository<ProcessedBlockEntity>,
    @InjectQueue(HandleTransactionQueue.name)
    private readonly handleTransactionQueue: TypedQueue<typeof HandleTransactionQueue>,
  ) {}

  public async onModuleInit() {
    const latestBlock = await this.web3.eth.getBlockNumber();
    const latestProcessedBlock = await this.processedBlockRepository.findOne({
      where: { blockNumber: Not(IsNull()) },
      order: {
        blockNumber: 'DESC',
      },
    });
    const nextProcessedBlockNumber = (latestProcessedBlock?.blockNumber
      ?? (latestBlock - 1n)/* BigInt(this.contractConfig.startBlockNumber - 1) TODO ? */) + 1n;

    await this.handlePastTransactions(nextProcessedBlockNumber, latestBlock);
    // eslint-disable-next-line max-len
    await this.subscribeForNewBlocks();// TODO handle the possible case where new blocks appeared before listening
  }

  private async handlePastTransactions(fromBlock: bigint, toBlock: bigint) {
    this.logger.info(`We receive transactions from block ${fromBlock} to ${toBlock}...`);

    for (let i = fromBlock; i <= toBlock; i++) {
      // eslint-disable-next-line no-await-in-loop
      await this.handleBlock(i);
    }
  }

  private async subscribeForNewBlocks() {
    const subscription = await this.web3.eth.subscribe('newBlockHeaders');
    subscription.on('data', async (blockHeader) => {
      if (!blockHeader.number) {
        throw new Error('Block header is undefined'); // TODO handle error?
      }
      this.logger.info({ blockNumber: Number(blockHeader.number) }, 'New block received');

      await this.handleBlock(BigInt(blockHeader.number));
    });

    subscription.on('error', (error) => {
      this.logger.error({ error }, 'Error subscribing to blocks:');
      // TODO handle error?
    });
  }

  private async handleBlock(blockNumber: bigint) {
    const block = await this.web3.eth.getBlock(blockNumber, true);
    await this.processTransactions(block.transactions as TransactionInfo[]);

    const blockEntity = this.processedBlockRepository.create({
      blockNumber: block.number,
    });
    await this.processedBlockRepository.save(blockEntity);
  }

  private async processTransactions(transactions: TransactionInfo[]) {
    const transactionsToHandle = transactions.filter(
      (t) => t.to && t.to.toLowerCase() === this.contractConfig.contractAddress.toLowerCase(),
    );
    await pAll(
      transactionsToHandle.map((transaction) => async () => {
        const stringHash = Buffer.from(transaction.hash).toString();
        const jobs = await this.handleTransactionQueue.getJobs();
        const existJob = jobs.find((j) => j.data.transaction.hash === stringHash);

        if (existJob) {
          this.logger.warn({ hash: stringHash }, 'Transaction already found for contract');
          return;
        }

        this.logger.info({ hash: stringHash }, 'Transaction found for contract');

        await this.handleTransactionQueue.add(
          stringHash,
          {
            transaction: {
              hash: stringHash,
              blockHash: transaction.blockHash
                ? Buffer.from(transaction.blockHash).toString()
                : undefined,
              blockNumber: Number(transaction.blockNumber),
              from: transaction.from,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              to: transaction.to!,
              transactionIndex: transaction.transactionIndex?.toString(),
              value: transaction.value?.toString(),
              type: transaction.type?.toString(),
              chainId: transaction.chainId?.toString(),
              input: transaction.input ? Buffer.from(transaction.input).toString() : undefined,
            },
          },
          { attempts: 5 },
        );
      }),
      { concurrency: 1 },
    );
  }
}
