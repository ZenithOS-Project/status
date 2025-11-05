import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const db = postgres(DATABASE_URL);

export async function initDb() {
  await db`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      url TEXT NOT NULL,
      type TEXT DEFAULT 'http',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await db`
    CREATE TABLE IF NOT EXISTS health_checks (
      id SERIAL PRIMARY KEY,
      service_id INT REFERENCES services(id) ON DELETE CASCADE,
      status TEXT NOT NULL,
      response_time INT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await db`
    CREATE INDEX IF NOT EXISTS idx_service_time 
    ON health_checks(service_id, created_at)
  `;
}
