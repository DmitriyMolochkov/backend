import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import Web3, {
  AbiFunctionFragment,
  Bytes,
  Contract,
  ContractAbi,
} from 'web3';
import { TransactionInfo } from 'web3-types/src/eth_types';

import { ETHEREUM_CONTRACT_TOKEN, WEB_3_TOKEN } from './ethereum-contract.constants';
import { TransactionNotFoundException } from './exceptions/business-exceptions';

@Injectable()
export class EthereumContractService {
  public constructor(
    @InjectPinoLogger(EthereumContractService.name) private readonly logger: PinoLogger,
    @Inject(WEB_3_TOKEN) private readonly web3: Web3,
    @Inject(ETHEREUM_CONTRACT_TOKEN) private readonly contract: Contract<ContractAbi>,
  ) {}

  public async requestTransactionByHash(hash: Bytes) {
    const transaction = await this.web3.eth.getTransaction(hash);

    if (!transaction) {
      throw new TransactionNotFoundException(hash.toString());
    }

    return transaction;
  }

  public getContractMethod(transaction: TransactionInfo) {
    const stringInput = Buffer.from(transaction.input ?? '').toString();
    if (stringInput === '0x') {
      return null;
    }

    const methodSignature = stringInput.slice(0, 10);

    for (const method of this.contract.options.jsonInterface) {
      if (method.type === 'function') {
        const abiFunctionFragment = method as AbiFunctionFragment;
        const signature = this.web3.eth.abi.encodeFunctionSignature(abiFunctionFragment);
        if (signature === methodSignature) {
          return abiFunctionFragment.name;
        }
      }
    }

    return null;
  }
}
