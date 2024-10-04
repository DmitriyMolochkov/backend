import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import pino from 'pino';

import { Config, Environment } from 'infrastructure/config';
import { PackageJson } from 'infrastructure/package-json';

const pinoConfigsObj: Record<Environment, pino.LoggerOptions> = {
  development: {
    transport: {
      target: 'pino-pretty',
    },
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  production: {},
};

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [Config, PackageJson],
      useFactory: (config: Config, packageJson: PackageJson) => ({
        pinoHttp: {
          ...pinoConfigsObj[config.configEnv],
          name: packageJson.name,
          level: config.logger.level,
        },
        exclude: ['bull/(.*)'],
        forRoutes: ['*'],
      }),
    }),
  ],
})
export class LoggerModule {}
