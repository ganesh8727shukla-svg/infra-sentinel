import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { MapLegend, MapPanel } from "@/components/maps/MapPanel";
import { StatusBadge } from "@/components/ui/status-badge";
import { ErrorState, TableSkeleton } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { useAssets } from "@/hooks/useInfraData";
import { riskLevel } from "@/utils/format";
import { seo } from "@/lib/seo";
import type { RiskLevel } from "@/types";

export const Route = createFileRoute("/admin/map")({
  head: () =>
    seo("GIS & map", "Geospatial view of every monitored asset with district clustering and risk colouring."),
  component: MapPage,
});

const FILTERS: { key: RiskLevel | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "moderate", label: "Moderate" },
  { key: "healthy", label: "Healthy" },
];

function MapPage() {
  const assets = useAssets();
  const [filter, setFilter] = useState<RiskLevel | "all">("all");

  const rows = (assets.data ?? []).filter(
    (a) => filter === "all" || riskLevel(a.riskScore) === filter,
  );

  return (
    <>
      <PageHeader
        title="GIS & map"
        subtitle="Spatial distribution of infrastructure risk across the jurisdiction."
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "GIS & Map" }]}
      />

      {assets.isError ? (
        <ErrorState onRetry={() => void assets.refetch()} />
      ) : assets.isLoading ? (
        <TableSkeleton rows={6} cols={2} />
      ) : (
        <div className="grid gap-5 xl:grid-cols-4">
          <Section className="xl:col-span-3" bodyClassName="space-y-3">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <Button
                  key={f.key}
                  size="sm"
                  variant={filter === f.key ? "default" : "outline"}
                  aria-pressed={filter === f.key}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
            <MapPanel assets={rows} height={560} />
            <MapLegend />
          </Section>

          <Section title={`Assets (${rows.length})`} bodyClassName="p-0 sm:p-0">
            <ul className="max-h-[560px] divide-y divide-border overflow-y-auto">
              {rows.map((a) => (
                <li key={a.id} className="px-4 py-3">
                  <Link
                    to="/admin/assets/$assetId"
                    params={{ assetId: a.id }}
                    className="text-sm font-medium text-foreground hover:text-primary hover:underline"
                  >
                    {a.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {a.district} · {a.type}
                  </p>
                  <div className="mt-1.5">
                    <StatusBadge level={riskLevel(a.riskScore)} label={`Risk ${a.riskScore}`} />
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}
    </>
  );
}
