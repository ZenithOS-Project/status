import { getServicesWithHistory } from "@/lib/statusData";
import { getOverallStatus } from "@/lib/formatUtils";

import { StatusCard } from "@/components/statusCard";
import { ServicesList } from "@/components/servicesList";

export default async function StatusPage() {
  const servicesWithHistory = await getServicesWithHistory();
  const overallStatus = getOverallStatus(
    servicesWithHistory.map((s) => s.service),
  );

  return (
    <div className="mx-auto max-w-4xl p-6">
      <StatusCard status={overallStatus} />
      <ServicesList services={servicesWithHistory} />
    </div>
  );
}
