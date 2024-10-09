import { Injectable } from '@nestjs/common';
import Web3 from 'web3';

import { UserViewDto } from '../dtos';
import { UserEntity } from '../entities';

const web3 = new Web3();

@Injectable()
export class UserMapper {
  public mapToView(
    ormEntity: UserEntity,
    {
      ethBalanceInWei,
      addBalance,
    }: {
      ethBalanceInWei: bigint;
      addBalance: number;
    },
  ): UserViewDto {
    return new UserViewDto({
      ...ormEntity,
      ethBalance: Number(web3.utils.fromWei(ethBalanceInWei, 'ether')),
      addBalance,
    });
  }
}
