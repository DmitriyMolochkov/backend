import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';

import { ContractService } from './contract.service';
import { UserLoginDto, UserWithdrawDto } from './dtos';
import { UserDepositDto } from './dtos/user-deposit.dto';
import { UserEntity } from './entities';
import {
  InsufficientFundsException,
  UserDuplicationException,
  UserNotFoundException,
} from './exceptions/business-exceptions';

@Injectable()
export class UserService {
  public constructor(
    @InjectPinoLogger(UserService.name) private readonly logger: PinoLogger,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly contractService: ContractService,
  ) {}

  public async getByWalletAddress(walletAddress: UserEntity['walletAddress']) {
    const note = await this.userRepository.findOne({
      where: { walletAddress },
    });
    if (!note) {
      throw new UserNotFoundException(walletAddress);
    }

    return note;
  }

  public async create(createDto: UserLoginDto) {
    const existNote = await this.userRepository.findOneBy({
      walletAddress: createDto.walletAddress,
    });
    if (existNote) {
      throw new UserDuplicationException(['walletAddress']);
    }

    const note = this.userRepository.create({
      ...createDto,
      signature: 'TODO', // TODO
      ethBalance: 0,
      addBalance: 0,
    });

    await this.userRepository.save(note);

    this.logger.info({ walletAddress: note.walletAddress }, `${UserEntity.name} created`);

    return note;
  }

  public async withdraw(withdrawDto: UserWithdrawDto) {
    const user = await this.getByWalletAddress(withdrawDto.toWalletAddress);
    // TODO block user record during check?
    if (user.ethBalance < withdrawDto.amount) {
      throw new InsufficientFundsException();
    }
    await this.contractService.withdraw(withdrawDto.amount, withdrawDto.toWalletAddress);

    user.ethBalance -= withdrawDto.amount;
    await this.userRepository.save(user);

    return user;
  }

  public async deposit(depositDto: UserDepositDto) {
    const user = await this.getByWalletAddress(depositDto.fromWalletAddress);
    // TODO check deposit transaction?

    user.ethBalance += depositDto.amount;
    await this.userRepository.save(user);

    return user;
  }
}
