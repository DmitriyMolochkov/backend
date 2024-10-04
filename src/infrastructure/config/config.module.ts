import { DynamicModule, Module } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { Config } from './config';
import * as Parts from './parts';
import { plainConfig } from './plain-config';

const ConfigPartConstructors = Object.values(Parts) as Constructor<Partial<typeof Parts>>[];

@Module({})
export class ConfigModule {
  public static forRoot(): DynamicModule {
    return {
      module: ConfigModule,
      global: true,
      providers: [
        {
          provide: Config,
          useFactory: () => ConfigModule.configFactory(),
        },
        ...ConfigPartConstructors.map((Part) => ({
          provide: Part,
          useFactory: (config: Config) => {
            const configPart = (Object.values(config) as Partial<Config>[])
              .find((part) => part instanceof Part);
            if (!configPart) {
              throw new Error(`${Part.name} not founded in ${Config.name}`);
            }

            return configPart;
          },
          inject: [Config],
        })),
      ],
      exports: [Config, ...ConfigPartConstructors],
    };
  }

  private static async configFactory(): Promise<Config> {
    const config = await ConfigModule.loadConfig();
    await ConfigModule.validateConfig(config);

    return config;
  }

  private static async loadConfig(): Promise<Config> {
    return plainToInstance(Config, plainConfig);
  }

  private static async validateConfig(config: Config): Promise<void> {
    const errors = await validate(config, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new Error(errors.map((x) => x.toString()).join('\n'));
    }
  }
}
