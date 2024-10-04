import path from 'path';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import RedisStore from 'connect-redis';
import session from 'express-session';
import { Redis } from 'ioredis';
import { Logger, LoggerErrorInterceptor, PinoLogger } from 'nestjs-pino';
import passport from 'passport';

import { AppModule } from './app.module';
import { BusinessExceptionFilter } from './common/exceptions/business-exception.filter';
import { ValidationException } from './common/exceptions/business-exceptions';
import { Config, HttpConfig, RedisConnectionName } from './infrastructure/config';
import { PackageJson } from './infrastructure/package-json';
import { getRedisToken } from './infrastructure/redis/utils';

function setupSwagger(app: NestExpressApplication): void {
  const config = app.get(HttpConfig);
  const packageJson = app.get(PackageJson);

  const options = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setVersion(packageJson.version)
    .setDescription(packageJson.description)
    .addServer(config.swaggerServer)
    .addBearerAuth()
    .build();

  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, options));
}

function handleNodeErrorEvents(logger: PinoLogger) {
  process.on('uncaughtException', async (error) => {
    logger.fatal(error, 'Uncaught exception');
  });

  process.on('unhandledRejection', async (error) => {
    logger.fatal(error, 'Unhandled promise rejection');
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    await AppModule.register(),
    new ExpressAdapter(),
    {
      bufferLogs: true,
    },
  );

  const config = app.get(Config);
  const logger = await app.resolve(PinoLogger);
  logger.setContext('NestApplication');

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => new ValidationException(errors),
    }),
  );
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new BusinessExceptionFilter(httpAdapter));

  const redisClient = app.get<Redis>(getRedisToken(RedisConnectionName.default));
  const packageJson = app.get(PackageJson);
  app.use(
    session({
      secret: config.sessionKey,
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({
        client: redisClient,
        prefix: `${packageJson.name}:sess:`,
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.setBaseViewsDir(path.join(__dirname, '..', '..', 'views'));
  app.setViewEngine('ejs');

  setupSwagger(app);

  app.enableShutdownHooks();

  handleNodeErrorEvents(logger);

  await app.listen(config.http.port, config.http.host);

  logger.info(`Nest application listening on ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
