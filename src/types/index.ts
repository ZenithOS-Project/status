export interface Service {
  id: number;
  name: string;
  status: string;
  response_time: number;
}

export interface HistoryPoint {
  date: string;
  up: number;
  degraded: number;
  down: number;
}

export interface ServiceWithHistory {
  service: Service;
  history: HistoryPoint[];
}

export type OverallStatus = "up" | "degraded" | "down";
