import { Card, CardContent } from "@/components/ui/card";
import { ServiceCard } from "@/components/serviceCard";
import type { ServiceWithHistory } from "@/types";

interface ServicesListProps {
  services: ServiceWithHistory[];
}

export function ServicesList({ services }: ServicesListProps) {
  if (!services || services.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-red-600">
          No services configured yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {services.map(({ service, history }) => (
        <ServiceCard key={service.id} service={service} history={history} />
      ))}
    </div>
  );
}
