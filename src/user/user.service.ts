import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { EntityManager, Repository } from 'typeorm';

import { UserLoginDto } from './dtos';
import { UserEntity } from './entities';
import { UserDuplicationException, UserNotFoundException } from './exceptions/business-exceptions';
import { EthereumContractService } from '../ethereum-contract/ethereum-contract.service';

@Injectable()
export class UserService {
  public constructor(
    @InjectPinoLogger(UserService.name) private readonly logger: PinoLogger,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly contractService: EthereumContractService,
  ) {}

  public async getById(id: UserEntity['id']) {
    const note = await this.userRepository.findOne({
      where: { id },
    });
    if (!note) {
      throw new UserNotFoundException(id);
    }

    return note;
  }

  public async getByWalletAddress(walletAddress: UserEntity['walletAddress']) {
    const user = await this.userRepository.findOne({
      where: { walletAddress },
    });
    if (!user) {
      throw new UserNotFoundException(walletAddress);
    }

    return user;
  }

  public async create(createDto: UserLoginDto) {
    const user = await this.userRepository.manager.transaction(async (manager: EntityManager) => {
      await manager.query(`LOCK TABLE ${this.userRepository.metadata.tableName} IN EXCLUSIVE MODE`);

      const existUser = await manager.findOne(
        UserEntity,
        {
          where: {
            walletAddress: createDto.walletAddress,
          },
        },
      );

      if (existUser) {
        throw new UserDuplicationException(['walletAddress']);
      }

      const newUser = this.userRepository.create({
        ...createDto,
      });

      return manager.save(newUser);
    });

    this.logger.info({ walletAddress: user.walletAddress }, `${UserEntity.name} created`);

    return user;
  }
}
