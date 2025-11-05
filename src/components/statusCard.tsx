import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatusMessage } from "@/lib/formatUtils";
import type { OverallStatus } from "@/types";

interface StatusCardProps {
  status: OverallStatus;
}

export function StatusCard({ status }: StatusCardProps) {
  const getStatusStyles = (status: OverallStatus) => {
    switch (status) {
      case "up":
        return "bg-green-500/10 dark:bg-green-500/20 border border-green-500/30";
      case "degraded":
        return "bg-yellow-500/10 dark:bg-yellow-500/20 border border-yellow-500/30";
      case "down":
        return "bg-red-500/10 dark:bg-red-500/20 border border-red-500/30";
    }
  };

  const getStatusTextColor = (status: OverallStatus) => {
    switch (status) {
      case "up":
        return "text-green-600 dark:text-green-400";
      case "degraded":
        return "text-yellow-600 dark:text-yellow-400";
      case "down":
        return "text-red-600 dark:text-red-400";
    }
  };

  return (
    <Card
      className={`mb-8 h-full w-full overflow-hidden p-6 backdrop-blur-md ${getStatusStyles(status)}`}
    >
      <CardHeader className="">
        <CardTitle className="flex flex-row items-center justify-between">
          <h1 className="text-foreground text-sm font-semibold uppercase">
            System Status
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-3xl font-bold capitalize ${getStatusTextColor(status)}`}
        >
          {getStatusMessage(status)}
        </p>
      </CardContent>
    </Card>
  );
}
