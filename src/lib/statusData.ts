import { db } from "./db";
import type { Service, HistoryPoint, ServiceWithHistory } from "@/types";

export async function getServices(): Promise<Service[]> {
  const checks = await db`
    SELECT 
      DISTINCT ON (s.id)
      s.id, s.name, hc.status, hc.response_time, hc.created_at
    FROM services s
    LEFT JOIN health_checks hc ON s.id = hc.service_id
    ORDER BY s.id, hc.created_at DESC
  `;

  return checks.map((row: any) => ({
    id: Number(row.id),
    name: String(row.name),
    status: row.status ?? "unknown",
    response_time:
      row.response_time !== undefined && row.response_time !== null
        ? Number(row.response_time)
        : 0,
  }));
}

export async function getServiceHistory(
  serviceId: number,
  days: number = 7,
): Promise<HistoryPoint[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const history = await db`
    SELECT 
      DATE(created_at) as date,
      SUM(CASE WHEN status = 'up' THEN 1 ELSE 0 END) as up,
      SUM(CASE WHEN status = 'degraded' THEN 1 ELSE 0 END) as degraded,
      SUM(CASE WHEN status = 'down' THEN 1 ELSE 0 END) as down
    FROM health_checks
    WHERE service_id = ${serviceId} AND created_at >= ${startDate.toISOString()}
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;

  return history.map((row: any) => ({
    date: String(row.date),
    up: Number(row.up ?? 0),
    degraded: Number(row.degraded ?? 0),
    down: Number(row.down ?? 0),
  }));
}

export async function getServicesWithHistory(): Promise<ServiceWithHistory[]> {
  const services = await getServices();
  const results = await Promise.all(
    services.map(async (service) => ({
      service,
      history: await getServiceHistory(service.id, 7),
    })),
  );
  return results;
}
