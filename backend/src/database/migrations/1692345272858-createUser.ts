import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUser1692345272858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar', isNullable: true },
          { name: 'firstName', type: 'varchar', isNullable: true },
          { name: 'lastName', type: 'varchar', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
