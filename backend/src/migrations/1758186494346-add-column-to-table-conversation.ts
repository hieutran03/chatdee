import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnToTableConversation1758186494346 implements MigrationInterface {
    name = 'AddColumnToTableConversation1758186494346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" ADD "created_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`UPDATE "conversations" SET "created_at" = now() WHERE "created_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD "updated_at" TIMESTAMP DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "created_at"`);
    }

}
