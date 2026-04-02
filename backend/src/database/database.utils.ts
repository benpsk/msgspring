import { ContactRequestRecord, ContactRequestRow } from './database.types';

export function mapContactRequestRow(
  row: ContactRequestRow,
): ContactRequestRecord {
  return {
    ...row,
    created_at:
      row.created_at instanceof Date
        ? row.created_at
        : new Date(row.created_at),
  };
}

export function isDatabaseSslEnabled(
  value: string | boolean | undefined,
): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  return value === 'true';
}
