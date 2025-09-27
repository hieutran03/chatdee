import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableConversationTableUserInConversation1757904207027 implements MigrationInterface {
    name = 'CreateTableConversationTableUserInConversation1757904207027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_in_conversation_orm" ("user_id" uuid NOT NULL, "conversation_id" uuid NOT NULL, CONSTRAINT "PK_0d4ae71afe30747e17bd84ff56b" PRIMARY KEY ("user_id", "conversation_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."conversations_type_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."conversations_type_enum" NOT NULL, "title" character varying(100), "theme" text, "avatar" text, "created_by" uuid NOT NULL, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_in_conversation_orm" ADD CONSTRAINT "FK_c8f819ee3f1d52c7f95b29d4443" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_in_conversation_orm" ADD CONSTRAINT "FK_dce8812b5c070bf1d2e5408742a" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_81d92d15c62b3fff79c617c9043" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_81d92d15c62b3fff79c617c9043"`);
        await queryRunner.query(`ALTER TABLE "user_in_conversation_orm" DROP CONSTRAINT "FK_dce8812b5c070bf1d2e5408742a"`);
        await queryRunner.query(`ALTER TABLE "user_in_conversation_orm" DROP CONSTRAINT "FK_c8f819ee3f1d52c7f95b29d4443"`);
        await queryRunner.query(`DROP TABLE "conversations"`);
        await queryRunner.query(`DROP TYPE "public"."conversations_type_enum"`);
        await queryRunner.query(`DROP TABLE "user_in_conversation_orm"`);
    }

}
