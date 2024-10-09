import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { UserLoginDto } from './dtos';
import { UserEntity } from './entities';
import { UserNotFoundException } from './exceptions/business-exceptions';
import { UserExceptionFilter } from './exceptions/user-exception.filter';
import { UserMapper } from './mappers';
import { BalanceChangeMapper } from './mappers/balance-change.mapper';
import { UserService } from './user.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { BalanceChangeService } from '../balance-change/balance-change.service';
import { CoinType } from '../balance-change/enums';

@ApiTags('User')
@Controller({
  path: 'users',
  version: '1',
})
@UseFilters(UserExceptionFilter)
export class UserController {
  public constructor(
    private readonly userService: UserService,
    private readonly balanceChangeService: BalanceChangeService,
    private readonly userMapper: UserMapper,
    private readonly balanceChangeMapper: BalanceChangeMapper,
  ) {}

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  public async entity(@Req() req: Request) {
    const { walletAddress } = req.user as { walletAddress: string };
    const user = await this.userService.getByWalletAddress(walletAddress);

    return this.buildView(user);
  }

  @Get('me/transactions')
  @UseGuards(AuthenticatedGuard)
  public async transactions(@Req() req: Request) {
    const { walletAddress } = req.user as { walletAddress: string };
    const transactions = await this.balanceChangeService.getTransactionsByWalletAddress(
      walletAddress,
      CoinType.eth,
    );

    return transactions.map((t) => this.balanceChangeMapper.mapToTransactionView(t));
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  public async login(@Body() body: UserLoginDto) {
    let user: UserEntity | null = null;
    try {
      user = await this.userService.getByWalletAddress(body.walletAddress);
    } catch (err) {
      if (err instanceof UserNotFoundException) {
        user = await this.userService.create(body);
      } else {
        throw err;
      }
    }

    return this.buildView(user);
  }

  private async buildView(userEntity: UserEntity) {
    const ethBalanceInWei = await this.balanceChangeService.getWalletBalance(
      userEntity.walletAddress,
      CoinType.eth,
    );
    const addBalance = 0; // TODO implement

    return this.userMapper.mapToView(userEntity, { ethBalanceInWei, addBalance });
  }
}
