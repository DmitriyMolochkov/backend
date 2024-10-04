import { Global, Module } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PackageJson } from './package-json';
import pkgJson from '../../../package.json';

@Global()
@Module({
  providers: [
    {
      provide: PackageJson,
      async useFactory(): Promise<PackageJson> {
        return plainToInstance(
          PackageJson,
          pkgJson,
          { excludeExtraneousValues: true },
        );
      },
    },
  ],
  exports: [PackageJson],
})
export class PackageJsonModule {}
