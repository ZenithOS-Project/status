import { createClient } from "@supabase/supabase-js";
import { db } from "./db";

export async function checkAllServices() {
  const services = await db`
    SELECT id, name, url, token, type FROM services
  `;

  for (const service of services) {
    const start = Date.now();
    let status = "down";

    try {
      if (service.type === "postgres") {
        status = await checkPostgres(service.url, service.token);
      } else if (service.type === "mysql") {
        status = await checkMysql(service.url);
      } else {
        status = await checkHttp(service.url);
      }
    } catch (error) {
      console.error(`Health check failed for ${service.name}:`, error);
      status = "down";
    }

    const responseTime = Date.now() - start;

    await db`
      INSERT INTO health_checks (service_id, status, response_time)
      VALUES (${service.id}, ${status}, ${responseTime})
    `;
  }
}

async function checkHttp(url: string): Promise<string> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(5000),
  });
  return res.ok ? "up" : "degraded";
}

async function checkPostgres(
  supabaseUrl: string,
  token: string,
): Promise<string> {
  const client = createClient(supabaseUrl, token);

  try {
    await Promise.race([
      client.from("users").select("*").limit(1),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Postgres timeout")), 5000),
      ),
    ]);

    return "up";
  } catch (error) {
    console.error("Postgres health check failed:", error);
    return "down";
  }
}

async function checkMysql(connectionString: string): Promise<string> {
  try {
    const mysql = await import("mysql2/promise");
    const connection = await mysql.createConnection(connectionString);

    try {
      await connection.ping();
      return "up";
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("MySQL health check failed:", error);
    return "down";
  }
}
