import type { HistoryPoint, OverallStatus } from "@/types";

export function calculateUptime(day: HistoryPoint): number {
  const total = day.up + day.degraded + day.down;
  if (total === 0) return 100;
  return Math.round((day.up / total) * 100);
}

export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case "up":
      return "bg-green-100/80 text-green-800/80";
    case "degraded":
      return "bg-yellow-100/80 text-yellow-800/80";
    case "down":
      return "bg-red-100/80 text-red-800/80";
    default:
      return "bg-gray-100/80 text-gray-800/80";
  }
}

export function getColorForUptime(uptime: number): string {
  if (uptime === 100) return "#22c55e";
  if (uptime >= 95) return "#84cc16";
  if (uptime >= 50) return "#eab308";
  return "#ef4444";
}

export function getStatusCardStyles(status: OverallStatus): string {
  switch (status) {
    case "up":
      return "border-green-300 bg-green-50/80 text-green-700";
    case "degraded":
      return "border-yellow-300 bg-yellow-50/80 text-yellow-700";
    case "down":
      return "border-red-300 bg-red-50/80 text-red-700";
  }
}

export function getStatusMessage(status: OverallStatus): string {
  const messages = {
    up: "All Systems Operational",
    degraded: "Degraded Performance",
    down: "Service Down",
  };
  return messages[status];
}

export function getOverallStatus(services: any[]): OverallStatus {
  if (services.some((s) => s.status === "down")) return "down";
  if (services.some((s) => s.status === "degraded")) return "degraded";
  return "up";
}
