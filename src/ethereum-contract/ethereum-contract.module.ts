import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Web3, { ContractAbi } from 'web3';

import { ContractListenerService } from './ehereum-contrac-listener.service';
import { ProcessedBlockEntity } from './entities';
import contractAbiJson from './ethereum-contract-abi.json';
import {
  ETHEREUM_CONTRACT_ABI_TOKEN,
  ETHEREUM_CONTRACT_TOKEN,
  WEB_3_TOKEN,
} from './ethereum-contract.constants';
import { EthereumContractService } from './ethereum-contract.service';
import { HandleTransactionQueueEvents, HandleTransactionWorker } from './jobs';
import { HandleTransactionQueue } from './jobs/handle-transaction.queue';
import { BalanceChangeModule } from '../balance-change/balance-change.module';
import { registerBullQueue } from '../infrastructure/bullmq';
import { EthereumContractConfig } from '../infrastructure/config';

@Module({})
export class EthereumContractModule {
  public static forRoot(): DynamicModule {
    return {
      module: EthereumContractModule,
      imports: [
        TypeOrmModule.forFeature([ProcessedBlockEntity]),
        ...registerBullQueue(
          HandleTransactionQueue,
        ),
        BalanceChangeModule,
      ],
      providers: [
        {
          provide: WEB_3_TOKEN,
          useFactory: (contractConfig: EthereumContractConfig) => {
            const provider = new Web3.providers.WebsocketProvider(contractConfig.nodeWssUrl);
            const web3 = new Web3(provider);

            return web3;
          },
          inject: [EthereumContractConfig],
        },
        {
          provide: ETHEREUM_CONTRACT_ABI_TOKEN,
          useValue: contractAbiJson,
        },
        {
          provide: ETHEREUM_CONTRACT_TOKEN,
          useFactory: (web3: Web3, abi: ContractAbi, contractConfig: EthereumContractConfig) => {
            const contract = new web3.eth.Contract(abi, contractConfig.contractAddress);

            return contract;
          },
          inject: [WEB_3_TOKEN, ETHEREUM_CONTRACT_ABI_TOKEN, EthereumContractConfig],
        },
        EthereumContractService,
        ContractListenerService,
        HandleTransactionWorker,
        HandleTransactionQueueEvents,
      ],
      exports: [
        EthereumContractService,
      ],
    };
  }
}
