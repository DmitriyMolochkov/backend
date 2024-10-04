import { Expose } from 'class-transformer';

export class PackageJson {
  @Expose()
  public readonly name!: string;

  @Expose()
  public readonly version!: string;

  @Expose()
  public readonly description!: string;
}
