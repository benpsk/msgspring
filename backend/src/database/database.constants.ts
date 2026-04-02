export const DEFAULT_DATABASE_MAX_CONNECTIONS = 10;

export const INSERT_CONTACT_REQUEST_SQL = `
  INSERT INTO demo_requests (full_name, email, country, message)
  VALUES ($1, $2, $3, $4)
  RETURNING
    id,
    full_name,
    email,
    country,
    message,
    created_at
`;

export const CREATE_CONTACT_REQUESTS_TABLE_SQL = `
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
`;

export const CREATE_CONTACT_REQUESTS_CREATED_AT_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS demo_requests_created_at_idx
  ON demo_requests (created_at DESC)
`;
