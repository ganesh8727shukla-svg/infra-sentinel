import { Suspense, lazy, useEffect, useState } from "react";
import type { Asset } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { LEVEL_HEX, LEVEL_LABEL } from "@/utils/format";
import type { RiskLevel } from "@/types";

const InfrastructureMap = lazy(() => import("./InfrastructureMap"));

export function MapLegend() {
  const levels: RiskLevel[] = ["healthy", "moderate", "high", "critical"];
  return (
    <ul className="flex flex-wrap items-center gap-4">
      {levels.map((l) => (
        <li key={l} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: LEVEL_HEX[l] }}
            aria-hidden="true"
          />
          {LEVEL_LABEL[l]}
        </li>
      ))}
    </ul>
  );
}

/** Client-only Leaflet wrapper — the map bundle never loads during SSR. */
export function MapPanel({
  assets,
  height = 480,
  compact,
}: {
  assets: Asset[];
  height?: number;
  compact?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted)
    return <Skeleton className="w-full rounded-lg" style={{ height }} aria-label="Loading map" />;

  return (
    <Suspense
      fallback={<Skeleton className="w-full rounded-lg" style={{ height }} aria-label="Loading map" />}
    >
      <InfrastructureMap assets={assets} height={height} compact={compact ?? false} />
    </Suspense>
  );
}
