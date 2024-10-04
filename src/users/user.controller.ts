import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserLoginDto, UserWithdrawDto } from './dtos';
import { UserEntity } from './entities';
import { UserNotFoundException } from './exceptions/business-exceptions';
import { UserExceptionFilter } from './exceptions/user-exception.filter';
import { UserMapper } from './mappers';
import { UserService } from './user.service';

@ApiTags('User')
@Controller({
  path: 'users',
  version: '1',
})
@UseFilters(UserExceptionFilter)
export class UserController {
  public constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  /* @Get('me')
  public async entity(@Param() { id }: IdParam) {
    const note = await this.notesService.getByWalletAddress(id);

    return this.userMapper.mapToView(note);
  } */

  @Post('login')
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

    return this.userMapper.mapToView(user);
  }

  @Post('withdraw')
  public async withdraw(@Body() body: UserWithdrawDto) {
    const user = await this.userService.withdraw(body);

    return this.userMapper.mapToView(user);
  }
}
