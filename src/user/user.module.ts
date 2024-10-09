import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities';
import { UserMapper } from './mappers';
import { BalanceChangeMapper } from './mappers/balance-change.mapper';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BalanceChangeModule } from '../balance-change/balance-change.module';
import { EthereumContractModule } from '../ethereum-contract/ethereum-contract.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    EthereumContractModule.forRoot(),
    BalanceChangeModule,
  ],
  providers: [
    UserService,
    UserMapper,
    BalanceChangeMapper,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
