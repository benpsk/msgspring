import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDemoRequests1743552000000 implements MigrationInterface {
  name = 'CreateDemoRequests1743552000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS demo_requests (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        full_name VARCHAR(120) NOT NULL,
        email VARCHAR(320) NOT NULL,
        country VARCHAR(120) NOT NULL,
        message TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT demo_requests_full_name_length CHECK (char_length(full_name) BETWEEN 2 AND 120),
        CONSTRAINT demo_requests_country_length CHECK (char_length(country) BETWEEN 2 AND 120),
        CONSTRAINT demo_requests_email_length CHECK (char_length(email) BETWEEN 5 AND 320),
        CONSTRAINT demo_requests_message_length CHECK (
          message IS NULL OR char_length(message) <= 2000
        )
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS demo_requests_created_at_idx
      ON demo_requests (created_at DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IF EXISTS demo_requests_created_at_idx',
    );
    await queryRunner.query('DROP TABLE IF EXISTS demo_requests');
  }
}
