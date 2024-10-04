import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContractService } from './contract.service';
import { UserEntity } from './entities';
import { UserMapper } from './mappers';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    UserService,
    UserMapper,
    ContractService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
