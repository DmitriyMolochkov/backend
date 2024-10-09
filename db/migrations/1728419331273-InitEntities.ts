import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitEntities1728419331273 implements MigrationInterface {
  public name = 'InitEntities1728419331273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "processed_blocks" ("block_number" bigint NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_456788c562e682a45d306fec9d5" PRIMARY KEY ("block_number"))');
    await queryRunner.query('CREATE TABLE "balance_changes" ("id" SERIAL NOT NULL, "wallet_address" character varying NOT NULL, "coin_type" character varying NOT NULL, "change_amount" bigint NOT NULL, "change_source" character varying NOT NULL, "txn_hash" character varying, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_dae6f21202d87ed004f5ac78740" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "users" ("id" SERIAL NOT NULL, "wallet_address" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_196ef3e52525d3cd9e203bdb1de" UNIQUE ("wallet_address"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TABLE "balance_changes"');
    await queryRunner.query('DROP TABLE "processed_blocks"');
  }
}
