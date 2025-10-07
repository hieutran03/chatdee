import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableConversation1759830919757 implements MigrationInterface {
    name = 'UpdateTableConversation1759830919757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" ADD "lastMessage" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "lastMessage"`);
    }

}
