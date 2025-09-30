import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableUicAndEnumType1759215721010 implements MigrationInterface {
    name = 'UpdateTableUicAndEnumType1759215721010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_81d92d15c62b3fff79c617c9043"`);
        await queryRunner.query(`ALTER TABLE "conversations" RENAME COLUMN "created_by" TO "owner"`);
        await queryRunner.query(`CREATE TYPE "public"."user_in_conversation_orm_role_enum" AS ENUM('admin', 'member')`);
        await queryRunner.query(`ALTER TABLE "user_in_conversation_orm" ADD "role" "public"."user_in_conversation_orm_role_enum" NOT NULL DEFAULT 'member'`);
        await queryRunner.query(`ALTER TYPE "public"."messages_action_enum" RENAME TO "messages_action_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."messages_action_enum" AS ENUM('send_message', 'update_message', 'delete_message', 'add_participant', 'remove_participant', 'update_participant')`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "action" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "action" TYPE "public"."messages_action_enum" USING "action"::"text"::"public"."messages_action_enum"`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "action" SET DEFAULT 'send_message'`);
        await queryRunner.query(`DROP TYPE "public"."messages_action_enum_old"`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_b0c7ad5c0740f51e3aa064366d9" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_b0c7ad5c0740f51e3aa064366d9"`);
        await queryRunner.query(`CREATE TYPE "public"."messages_action_enum_old" AS ENUM('send_message', 'add_participant', 'remove_participant')`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "action" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "action" TYPE "public"."messages_action_enum_old" USING "action"::"text"::"public"."messages_action_enum_old"`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "action" SET DEFAULT 'send_message'`);
        await queryRunner.query(`DROP TYPE "public"."messages_action_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."messages_action_enum_old" RENAME TO "messages_action_enum"`);
        await queryRunner.query(`ALTER TABLE "user_in_conversation_orm" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_in_conversation_orm_role_enum"`);
        await queryRunner.query(`ALTER TABLE "conversations" RENAME COLUMN "owner" TO "created_by"`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_81d92d15c62b3fff79c617c9043" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
