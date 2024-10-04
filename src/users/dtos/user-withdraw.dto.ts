import { IsInt, IsPositive } from 'class-validator';

import { IsTrimmedString } from 'common/class-validator';

export class UserWithdrawDto {
  @IsInt()
  @IsPositive()
  public readonly amount!: number;

  @IsTrimmedString()
  public readonly toWalletAddress!: string;
}
