import {
  IsEthereumAddress,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class EthereumContractConfig {
  @IsUrl({ protocols: ['wss'] })
  public readonly nodeWssUrl!: string;

  @IsEthereumAddress()
  public readonly contractAddress!: string;

  @IsOptional()
  @IsEthereumAddress()
  public readonly ownerAddress?: string;

  @IsOptional()
  @IsString()
  public readonly ownerPrivateKey?: string;

  @IsNumber()
  public readonly startBlockNumber!: number;
}
