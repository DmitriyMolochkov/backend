import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { EntityManager, Repository } from 'typeorm';

import { BalanceChangeCreateInfo } from './balance-change.types';
import { BalanceChangeEntity } from './entities';
import { CoinType } from './enums';

@Injectable()
export class BalanceChangeService {
  public constructor(
    @InjectPinoLogger(BalanceChangeService.name) private readonly logger: PinoLogger,
    @InjectRepository(BalanceChangeEntity)
    private readonly balanceChangeRepository: Repository<BalanceChangeEntity>,
  ) {}

  public async addBalanceChangeRecord(info: BalanceChangeCreateInfo) {
    const balanceChange = await this.balanceChangeRepository.manager.transaction(
      async (manager: EntityManager) => {
        await manager.query(
          `LOCK TABLE ${this.balanceChangeRepository.metadata.tableName} IN EXCLUSIVE MODE`,
        );

        const newBalanceChange = this.balanceChangeRepository.create({
          ...info,
        });

        return manager.save(newBalanceChange);
      },
    );

    this.logger.info({ ...balanceChange }, `${BalanceChangeEntity.name} created`);

    return balanceChange;
  }

  public async getTransactionsByWalletAddress(walletAddress: string, coinType: CoinType) {
    return this.balanceChangeRepository.find({
      where: { walletAddress, coinType },
      order: { createdAt: 'DESC' },
    });
  }

  public async getWalletBalance(
    walletAddress: string,
    coinType: CoinType,
    withLockTable: boolean = false,
  ): Promise<bigint> {
    const balance = await this.balanceChangeRepository.manager.transaction(
      async (manager: EntityManager) => {
        if (withLockTable) {
          await manager.query(
            `LOCK TABLE ${this.balanceChangeRepository.metadata.tableName} IN EXCLUSIVE MODE`,
          );
        }

        const result = await this.balanceChangeRepository
          .createQueryBuilder('balance_change')
          .select('SUM(balance_change.changeAmount)', 'total')
          .where('balance_change.walletAddress = :walletAddress', { walletAddress })
          .andWhere('balance_change.coinType = :coinType', { coinType })
          .getRawOne<{ total: bigint | null } | null>();

        return result?.total ?? 0n;
      },
    );

    return balance;
  }
}
