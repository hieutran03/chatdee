import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableMessage1759135371606 implements MigrationInterface {
    name = 'UpdateTableMessage1759135371606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."messages_action_enum" AS ENUM('send_message', 'add_participant', 'remove_participant')`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "action" "public"."messages_action_enum" NOT NULL DEFAULT 'send_message'`);
        await queryRunner.query(`ALTER TYPE "public"."messages_type_enum" RENAME TO "messages_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."messages_type_enum" AS ENUM('text', 'image', 'video', 'file', 'notification')`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "type" TYPE "public"."messages_type_enum" USING "type"::"text"::"public"."messages_type_enum"`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "type" SET DEFAULT 'text'`);
        await queryRunner.query(`DROP TYPE "public"."messages_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."messages_type_enum_old" AS ENUM('text', 'image', 'video', 'file')`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "type" TYPE "public"."messages_type_enum_old" USING "type"::"text"::"public"."messages_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "type" SET DEFAULT 'text'`);
        await queryRunner.query(`DROP TYPE "public"."messages_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."messages_type_enum_old" RENAME TO "messages_type_enum"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "action"`);
        await queryRunner.query(`DROP TYPE "public"."messages_action_enum"`);
    }

}
