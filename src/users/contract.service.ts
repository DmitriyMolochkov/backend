import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
// eslint-disable-next-line import/no-extraneous-dependencies
import Web3, { Contract } from 'web3';

import abi from './contract-abi.json';

@Injectable()
export class ContractService {
  private web3: Web3;
  private contract: Contract<typeof abi>;
  private account: string;
  private privateKey = 'YOUR_PRIVATE_KEY'; // TODO set from config

  public constructor(
    @InjectPinoLogger(ContractService.name) private readonly logger: PinoLogger,
  ) {
    const provider = new Web3.providers.WebsocketProvider(
      'wss://eth-mainnet.g.alchemy.com/v2/ScK1WWZHRPgt8xtmGzmaPlCGLjX7VQPp', // TODO set from config
    );
    this.web3 = new Web3(provider);
    this.account = {} as any; // this.web3.eth.accounts.privateKeyToAccount(this.privateKey).address;
    this.contract = new this.web3.eth.Contract(abi, this.account);
  }

  // TODO support add tokens?
  public async withdraw(amount: number, toWalletAddress: string): Promise<string> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
      const withdrawData = this.contract.methods['withdraw'](
        this.web3.utils.toWei(amount, 'ether'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ).encodeABI();

      const tx = {
        from: this.account,
        to: toWalletAddress,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: withdrawData,
        gas: 2000000,
      };

      const signedTx = await this.web3.eth.accounts.signTransaction(tx, this.privateKey);
      const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      this.logger.info('Tokens send, hash:', receipt.transactionHash);
      return receipt.transactionHash.toString();
    } catch (error) {
      this.logger.error('Error during withdraw:', error);
      throw error;
    }
  }
}
