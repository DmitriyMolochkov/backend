import { DynamicModule, Module } from '@nestjs/common';

import { UsersModule } from 'notes/users.module';

import { AppController } from './app.controller';

@Module({})
export class AppModule {
  public static async register(): Promise<DynamicModule> {
    // InfrastructureModule must be imported last, due to decorated providers
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { InfrastructureModule } = await import('./infrastructure/infrastructure.module');

    return {
      module: AppModule,
      controllers: [AppController],
      providers: [],
      imports: [
        InfrastructureModule,
        UsersModule,
      ],
    };
  }
}
