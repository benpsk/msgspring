export function normalizeCompactText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeOptionalMessage(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.replace(/\r\n/g, '\n').trim();

  return normalized.length > 0 ? normalized : undefined;
}
