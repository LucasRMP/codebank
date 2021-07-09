import { MigrationInterface, QueryRunner } from 'typeorm';

export class createSchema1625869119080 implements MigrationInterface {
  name = 'createSchema1625869119080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders_items" DROP CONSTRAINT "FK_53c21b56c3eebe5cd88525ccd6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_items" DROP CONSTRAINT "FK_1cd8f1320685153a88509931c98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_items" ALTER COLUMN "price" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_items" ADD CONSTRAINT "FK_1cd8f1320685153a88509931c98" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_items" ADD CONSTRAINT "FK_53c21b56c3eebe5cd88525ccd6e" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders_items" DROP CONSTRAINT "FK_53c21b56c3eebe5cd88525ccd6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_items" DROP CONSTRAINT "FK_1cd8f1320685153a88509931c98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_items" ALTER COLUMN "price" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_items" ADD CONSTRAINT "FK_1cd8f1320685153a88509931c98" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_items" ADD CONSTRAINT "FK_53c21b56c3eebe5cd88525ccd6e" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
