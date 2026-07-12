import { neon } from "@neondatabase/serverless";

// Returns a SQL tagged-template client, or null if no database is configured.
export function getSql() {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED;
  if (!url) return null;
  return neon(url);
}

export type Sql = NonNullable<ReturnType<typeof getSql>>;

let ensured = false;
export async function ensureTable(sql: Sql) {
  if (ensured) return;
  await sql`
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      client_name TEXT,
      address TEXT,
      system_size TEXT,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  ensured = true;
}
