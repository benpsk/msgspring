export function isDatabaseSslEnabled(
  value: string | boolean | undefined,
): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  return value === 'true';
}
