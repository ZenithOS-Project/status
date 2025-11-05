import { db } from "./db";
import postgres from "postgres";

export async function checkAllServices() {
  const services = await db`
    SELECT id, name, url, type FROM services
  `;

  for (const service of services) {
    const start = Date.now();
    let status = "down";

    try {
      if (service.type === "postgres") {
        status = await checkPostgres(service.url);
      } else if (service.type === "mysql") {
        status = await checkMysql(service.url);
      } else {
        status = await checkHttp(service.url);
      }
    } catch (error) {
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

async function checkPostgres(connectionString: string): Promise<string> {
  const client = postgres(connectionString, {
    connect_timeout: 5,
  });

  console.log("Checking Postgres connection...");

  try {
    try {
      const res = await client`SELECT 1`;
      console.log("Postgres query result:", res);
    } catch (error) {
      console.error("Error executing query:", error);
    }

    await client.end();
    return "up";
  } catch (error) {
    return "down";
  }
}

async function checkMysql(connectionString: string): Promise<string> {
  try {
    const mysql = await import("mysql2/promise");
    const connection = await mysql.createConnection(connectionString);
    await connection.ping();
    await connection.end();
    return "up";
  } catch (error) {
    return "down";
  }
}
