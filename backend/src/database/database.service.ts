import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnApplicationShutdown,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import {
  CREATE_CONTACT_REQUESTS_CREATED_AT_INDEX_SQL,
  CREATE_CONTACT_REQUESTS_TABLE_SQL,
  DEFAULT_DATABASE_MAX_CONNECTIONS,
  INSERT_CONTACT_REQUEST_SQL,
} from './database.constants';
import {
  ContactRequestRecord,
  ContactRequestRow,
  CreateContactRequestRecord,
} from './database.types';
import { isDatabaseSslEnabled, mapContactRequestRow } from './database.utils';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseService.name);
  private pool?: Pool;
  private schemaReadyPromise?: Promise<void>;

  constructor(private readonly configService: ConfigService) {}

  async createContactRequest(
    input: CreateContactRequestRecord,
  ): Promise<ContactRequestRecord> {
    const pool = this.getPool();

    await this.ensureSchema(pool);

    try {
      const result = await pool.query<ContactRequestRow>(
        INSERT_CONTACT_REQUEST_SQL,
        [input.full_name, input.email, input.country, input.message ?? null],
      );

      return mapContactRequestRow(result.rows[0]);
    } catch (error) {
      this.logger.error(
        'Failed to persist contact request',
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        'Could not save the contact request.',
      );
    }
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = undefined;
    }
  }

  private getPool(): Pool {
    if (this.pool) {
      return this.pool;
    }

    const connectionString = this.configService.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new ServiceUnavailableException('DATABASE_URL is not configured.');
    }

    const sslEnabled = this.isSslEnabled(
      this.configService.get<string | boolean>('DATABASE_SSL'),
    );
    const maxConnections = Number(
      this.configService.get('DATABASE_MAX_CONNECTIONS') ??
        DEFAULT_DATABASE_MAX_CONNECTIONS,
    );

    this.pool = new Pool({
      connectionString,
      max: maxConnections,
      ssl: sslEnabled
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
    });

    this.pool.on('error', (error: Error) => {
      this.logger.error('Unexpected PostgreSQL client error', error.stack);
    });

    return this.pool;
  }

  private async ensureSchema(pool: Pool): Promise<void> {
    if (this.schemaReadyPromise === undefined) {
      this.schemaReadyPromise = this.initializeSchema(pool).catch(
        (error: unknown) => {
          this.schemaReadyPromise = undefined;

          this.logger.error(
            'Failed to initialize the database schema',
            error instanceof Error ? error.stack : undefined,
          );

          throw new InternalServerErrorException(
            'Database schema is not ready.',
          );
        },
      );
    }

    await this.schemaReadyPromise;
  }

  private async initializeSchema(pool: Pool): Promise<void> {
    await pool.query(CREATE_CONTACT_REQUESTS_TABLE_SQL);
    await pool.query(CREATE_CONTACT_REQUESTS_CREATED_AT_INDEX_SQL);
  }

  private isSslEnabled(value: string | boolean | undefined): boolean {
    return isDatabaseSslEnabled(value);
  }
}
