import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { isDatabaseSslEnabled } from './database.utils';
import { ContactRequestEntity } from '../contact/entities/contact-request.entity';
import { CreateDemoRequests1743552000000 } from './migrations/1743552000000-create-demo-requests';

type DatabaseConnectionConfig = {
  databaseUrl?: string;
  databaseSsl?: string | boolean;
  databaseMaxConnections?: string | number;
  databaseReadReplicaUrls?: string[];
};

const entities = [ContactRequestEntity];
const migrations = [CreateDemoRequests1743552000000];

function normalizeReplicaUrls(value?: string | string[]): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return value
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);
}

function buildDataSourceOptions({
  databaseUrl,
  databaseSsl,
  databaseMaxConnections,
  databaseReadReplicaUrls,
}: DatabaseConnectionConfig): DataSourceOptions {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured.');
  }

  const parsedDatabaseMaxConnections = Number(databaseMaxConnections ?? 10);
  const normalizedReplicaUrls = normalizeReplicaUrls(databaseReadReplicaUrls);

  const baseOptions = {
    type: 'postgres' as const,
    entities,
    migrations,
    synchronize: false,
    extra: {
      max: Number.isFinite(parsedDatabaseMaxConnections)
        ? parsedDatabaseMaxConnections
        : 10,
    },
    ssl: isDatabaseSslEnabled(databaseSsl)
      ? {
          rejectUnauthorized: false,
        }
      : false,
  };

  if (normalizedReplicaUrls.length > 0) {
    return {
      ...baseOptions,
      replication: {
        master: {
          type: 'postgres',
          url: databaseUrl,
        },
        slaves: normalizedReplicaUrls.map((url) => ({
          type: 'postgres',
          url,
        })),
      },
    };
  }

  return {
    ...baseOptions,
    url: databaseUrl,
  };
}

export function getTypeOrmModuleOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return buildDataSourceOptions({
    databaseUrl: configService.get<string>('DATABASE_URL'),
    databaseSsl: configService.get<string | boolean>('DATABASE_SSL'),
    databaseMaxConnections: configService.get<string | number>(
      'DATABASE_MAX_CONNECTIONS',
    ),
    databaseReadReplicaUrls: configService.get<string | string[] | undefined>(
      'DATABASE_READ_REPLICA_URLS',
    ),
  });
}

export function createMigrationDataSourceFromEnv(): DataSource {
  return new DataSource(
    buildDataSourceOptions({
      databaseUrl: process.env.DATABASE_URL,
      databaseSsl: process.env.DATABASE_SSL,
      databaseMaxConnections: process.env.DATABASE_MAX_CONNECTIONS,
      databaseReadReplicaUrls: normalizeReplicaUrls(
        process.env.DATABASE_READ_REPLICA_URLS,
      ),
    }),
  );
}
