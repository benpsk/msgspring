const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
require('reflect-metadata');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const contents = fs.readFileSync(filePath, 'utf8');

  for (const rawLine of contents.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (line === '' || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();

    if (key === '' || key in process.env) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function loadEnvironment() {
  const cwd = process.cwd();
  const nodeEnv = process.env.NODE_ENV;

  loadEnvFile(path.join(cwd, '.env'));

  if (nodeEnv) {
    loadEnvFile(path.join(cwd, `.env.${nodeEnv}`));
  }
}

function resolveDataSourceModulePath() {
  const sourcePath = path.resolve(__dirname, '..', 'src', 'database', 'data-source.ts');
  const buildPath = path.resolve(__dirname, '..', 'dist', 'database', 'data-source.js');

  try {
    require('ts-node/register/transpile-only');

    if (fs.existsSync(sourcePath)) {
      return sourcePath;
    }
  } catch {}

  if (fs.existsSync(buildPath)) {
    return buildPath;
  }

  throw new Error(
    'Could not find a TypeORM data source. Build the backend or install dev dependencies first.',
  );
}

function getMigrationsTableName(dataSource) {
  return dataSource.options.migrationsTableName ?? 'migrations';
}

async function getAppliedMigrations(dataSource) {
  const migrationsTableName = getMigrationsTableName(dataSource);

  try {
    const rows = await dataSource.query(
      `SELECT name FROM "${migrationsTableName}" ORDER BY id ASC`,
    );

    return new Set(rows.map((row) => row.name));
  } catch (error) {
    if (error && typeof error === 'object' && error.code === '42P01') {
      return new Set();
    }

    throw error;
  }
}

async function createDataSource() {
  loadEnvironment();

  const modulePath = resolveDataSourceModulePath();
  const loadedModule = require(modulePath);

  if (typeof loadedModule.createMigrationDataSourceFromEnv !== 'function') {
    throw new Error('The TypeORM data source factory is not available.');
  }

  return loadedModule.createMigrationDataSourceFromEnv();
}

async function runStatus(dataSource) {
  const appliedMigrations = await getAppliedMigrations(dataSource);

  for (const migration of dataSource.migrations) {
    const status = appliedMigrations.has(migration.name) ? 'applied' : 'pending';
    console.log(`${status.padEnd(7)} ${migration.name}`);
  }
}

async function runMigrations(dataSource) {
  const executedMigrations = await dataSource.runMigrations();

  if (executedMigrations.length === 0) {
    console.log('No pending migrations.');
    return;
  }

  for (const migration of executedMigrations) {
    console.log(`Applied ${migration.name}`);
  }
}

async function main() {
  const command = process.argv[2] ?? 'up';
  const dataSource = await createDataSource();

  try {
    await dataSource.initialize();

    if (command === 'status') {
      await runStatus(dataSource);
      return;
    }

    if (command !== 'up') {
      throw new Error(`Unknown command: ${command}`);
    }

    await runMigrations(dataSource);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : error;
  console.error(message);
  process.exitCode = 1;
});
