export class UserViewDto {
  public readonly id: number;
  public readonly walletAddress: string;
  public readonly signature: string;
  public readonly ethBalance: number;
  public readonly addBalance: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(entity: UserViewDto) {
    this.id = entity.id;
    this.walletAddress = entity.walletAddress;
    this.signature = entity.signature;
    this.ethBalance = entity.ethBalance;
    this.addBalance = entity.addBalance;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
