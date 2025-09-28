import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableUic1759073107958 implements MigrationInterface {
    name = 'UpdateTableUic1759073107958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_in_conversation_orm" DROP CONSTRAINT "FK_dce8812b5c070bf1d2e5408742a"`);
        await queryRunner.query(`ALTER TABLE "user_in_conversation_orm" ADD CONSTRAINT "FK_dce8812b5c070bf1d2e5408742a" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_in_conversation_orm" DROP CONSTRAINT "FK_dce8812b5c070bf1d2e5408742a"`);
        await queryRunner.query(`ALTER TABLE "user_in_conversation_orm" ADD CONSTRAINT "FK_dce8812b5c070bf1d2e5408742a" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
