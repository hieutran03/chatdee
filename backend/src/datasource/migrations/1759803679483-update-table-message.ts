import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableMessage1759803679483 implements MigrationInterface {
    name = 'UpdateTableMessage1759803679483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."messages_action_enum" RENAME TO "messages_action_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."messages_action_enum" AS ENUM('send_message', 'update_message', 'delete_message', 'add_member', 'remove_member', 'update_member', 'leave_conversation', 'change_owner', 'update_conversation')`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "action" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "action" TYPE "public"."messages_action_enum" USING "action"::"text"::"public"."messages_action_enum"`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "action" SET DEFAULT 'send_message'`);
        await queryRunner.query(`DROP TYPE "public"."messages_action_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."messages_action_enum_old" AS ENUM('send_message', 'update_message', 'delete_message', 'add_participant', 'remove_participant', 'update_participant')`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "action" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "action" TYPE "public"."messages_action_enum_old" USING "action"::"text"::"public"."messages_action_enum_old"`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "action" SET DEFAULT 'send_message'`);
        await queryRunner.query(`DROP TYPE "public"."messages_action_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."messages_action_enum_old" RENAME TO "messages_action_enum"`);
    }

}
