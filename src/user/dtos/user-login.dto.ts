import { IsLowercase, IsTrimmedString } from 'common/class-validator';

export class UserLoginDto {
  @IsTrimmedString()
  @IsLowercase()
  public readonly walletAddress!: string;
}
