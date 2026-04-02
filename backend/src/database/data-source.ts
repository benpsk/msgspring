import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { isDatabaseSslEnabled } from './database.utils';
import { ContactRequestEntity } from './entities/contact-request.entity';
import { CreateDemoRequests1743552000000 } from './migrations/1743552000000-create-demo-requests';

type DatabaseConnectionConfig = {
  databaseUrl?: string;
  databaseSsl?: string | boolean;
  databaseMaxConnections?: string | number;
};

const entities = [ContactRequestEntity];
const migrations = [CreateDemoRequests1743552000000];

function buildDataSourceOptions({
  databaseUrl,
  databaseSsl,
  databaseMaxConnections,
}: DatabaseConnectionConfig): DataSourceOptions {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured.');
  }

  const parsedDatabaseMaxConnections = Number(databaseMaxConnections ?? 10);

  return {
    type: 'postgres',
    url: databaseUrl,
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
  });
}

export function createMigrationDataSourceFromEnv(): DataSource {
  return new DataSource(
    buildDataSourceOptions({
      databaseUrl: process.env.DATABASE_URL,
      databaseSsl: process.env.DATABASE_SSL,
      databaseMaxConnections: process.env.DATABASE_MAX_CONNECTIONS,
    }),
  );
}
