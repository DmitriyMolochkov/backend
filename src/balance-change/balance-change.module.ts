import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalanceChangeService } from './balance-change.service';
import { BalanceChangeEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([BalanceChangeEntity]),
  ],
  providers: [
    BalanceChangeService,
  ],
  exports: [
    BalanceChangeService,
  ],
})
export class BalanceChangeModule {}
