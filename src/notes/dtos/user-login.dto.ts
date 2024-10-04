import { IsTrimmedString } from 'common/class-validator';

export class UserLoginDto {
  @IsTrimmedString()
  public readonly walletAddress!: string;
}
