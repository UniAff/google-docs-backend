import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDocument1731410096620 implements MigrationInterface {
    name = 'AddDocument1731410096620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "document" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "content" json NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "document"
        `);
    }

}
