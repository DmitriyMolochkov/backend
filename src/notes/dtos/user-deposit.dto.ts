import { IsInt, IsPositive } from 'class-validator';

import { IsTrimmedString } from 'common/class-validator';

export class UserDepositDto {
  @IsInt()
  @IsPositive()
  public readonly amount!: number;

  @IsTrimmedString()
  public readonly fromWalletAddress!: string;

  @IsTrimmedString()
  public transaction!: string;
}
