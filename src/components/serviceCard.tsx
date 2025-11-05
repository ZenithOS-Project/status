import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatusBadgeColor } from "@/lib/formatUtils";
import { HistoryBars } from "@/components/historyBars";
import type { Service, HistoryPoint } from "@/types";

interface ServiceCardProps {
  service: Service;
  history: HistoryPoint[];
}

export function ServiceCard({ service, history }: ServiceCardProps) {
  return (
    <Card className="bg-card/60 dark:bg-card/80 h-full w-full overflow-hidden p-6 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{service.name}</CardTitle>
            <p className="text-sm text-gray-500">{service.response_time}ms</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeColor(
              service.status || "unknown",
            )}`}
          >
            {service.status
              ? service.status.charAt(0).toUpperCase() + service.status.slice(1)
              : "Unknown"}
          </span>
        </div>
      </CardHeader>

      {history.length > 0 && (
        <CardContent>
          <HistoryBars history={history} />
        </CardContent>
      )}
    </Card>
  );
}
