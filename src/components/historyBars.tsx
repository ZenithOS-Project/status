import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateUptime, getColorForUptime } from "@/lib/formatUtils";
import type { HistoryPoint } from "@/types";

interface HistoryBarsProps {
  history: HistoryPoint[];
}

export function HistoryBars({ history }: HistoryBarsProps) {
  if (history.length === 0) return null;

  const averageUptime = Math.round(
    history.reduce((sum, day) => sum + calculateUptime(day), 0) /
      history.length,
  );

  return (
    <>
      <p className="text-muted-foreground mb-2 text-sm">
        {averageUptime}% in the last {history.length} days
      </p>

      <TooltipProvider>
        <div className="flex gap-0.5">
          {history.map((day, idx) => {
            const dayUptime = calculateUptime(day);
            const color = getColorForUptime(dayUptime);

            return (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <div
                    className="h-8 flex-1 cursor-pointer rounded-sm transition-opacity hover:opacity-100"
                    style={{ backgroundColor: color, opacity: 0.8 }}
                  />
                </TooltipTrigger>
                <TooltipContent className="space-y-2">
                  <div>
                    <p className="font-semibold">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between gap-4">
                      <span className="text-green-600">✓ Up:</span>
                      <span className="font-medium">{day.up}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-yellow-600">⚠ Degraded:</span>
                      <span className="font-medium">{day.degraded}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-red-600">✕ Down:</span>
                      <span className="font-medium">{day.down}</span>
                    </div>
                  </div>
                  <div className="border-muted border-t pt-2">
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span className="font-semibold">{dayUptime}%</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </>
  );
}
