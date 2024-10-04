# Description

NestJs layout application with TypeORM

# Running the app

```bash

# copy env
$ cp .env.example .env

# app start
$ docker-compose up -d

# run migrations
$ docker-compose exec app npm run migration:run
```
# Modules

## Swagger
- Swagger documentation url [/api](http://127.0.0.1:8080/api) or [/api-json](http://127.0.0.1:8080/api-json)

## Healthchecks
- Healthchecks api url [/api/health](http://127.0.0.1:8080/api/health)

## BullMQ Board
- UI url [/api/bull/queues](http://127.0.0.1:8080/api/bull/queues)
- Default login/password - bull/bull or change envs **BULL_BOARD_USERNAME** and **BULL_BOARD_PASSWORD**

## Other
- Redis Cache - **RedisModule**
- PostgreSQL - **PostgresModule**
- Pino Logger - **LoggerModule**
