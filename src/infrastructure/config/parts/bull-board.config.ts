import { IsDefined, IsString } from 'class-validator';

export class BullBoardConfig {
  @IsDefined()
  @IsString()
  public readonly username!: string;

  @IsDefined()
  @IsString()
  public readonly password!: string;
}
