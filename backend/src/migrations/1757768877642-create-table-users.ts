import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUsers1757768877642 implements MigrationInterface {
    name = 'CreateTableUsers1757768877642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."role_enum" NOT NULL DEFAULT 'user', "name" character varying(100) NOT NULL, "born_year" integer NOT NULL, "email" character varying(100) NOT NULL, "avatar" character varying(255) NOT NULL, "hashed_password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."role_enum"`);
    }

}
