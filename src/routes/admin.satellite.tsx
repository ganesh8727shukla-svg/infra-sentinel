import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Satellite } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { MetaItem, Section } from "@/components/ui/section";
import { StatePill } from "@/components/ui/status-badge";
import { ErrorState, TableSkeleton } from "@/components/ui/states";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssets, useSatellite } from "@/hooks/useInfraData";
import { formatDate } from "@/utils/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/satellite")({
  head: () =>
    seo(
      "Satellite intelligence",
      "Multi-year satellite observation timelines, change detection and environmental risk per asset.",
    ),
  component: SatellitePage,
});

function SatellitePage() {
  const assets = useAssets();
  const [assetId, setAssetId] = useState<string>("");
  const list = assets.data ?? [];
  const selectedId = assetId || list[0]?.id || "";
  const record = useSatellite(selectedId);

  return (
    <>
      <PageHeader
        title="Satellite intelligence"
        subtitle="Earth observation signals layered on top of the asset registry."
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Satellite Intelligence" }]}
      />

      {assets.isError ? (
        <ErrorState onRetry={() => void assets.refetch()} />
      ) : assets.isLoading ? (
        <TableSkeleton rows={5} cols={3} />
      ) : (
        <div className="space-y-5">
          <Section bodyClassName="flex flex-wrap items-center gap-3">
            <Select value={selectedId} onValueChange={setAssetId}>
              <SelectTrigger className="w-80" aria-label="Select asset">
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                {list.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name} · {a.assetCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Satellite className="size-3.5" aria-hidden="true" />
              Observation data refreshed weekly
            </p>
          </Section>

          {record.isLoading || !record.data ? (
            <TableSkeleton rows={4} cols={3} />
          ) : (
            <div className="grid gap-5 xl:grid-cols-3">
              <Section title="Current assessment" bodyClassName="space-y-4">
                <dl className="grid gap-4">
                  <MetaItem label="Development status" value={record.data.developmentStatus} />
                  <MetaItem
                    label="Change detection"
                    value={<StatePill>{record.data.changeDetection}</StatePill>}
                  />
                  <MetaItem
                    label="Environmental risk"
                    value={<StatePill>{record.data.environmentalRisk}</StatePill>}
                  />
                  <MetaItem label="Last observation" value={formatDate(record.data.lastObservation)} />
                </dl>
              </Section>

              <Section title="Observation timeline" className="xl:col-span-2" bodyClassName="p-0 sm:p-0">
                <ul className="divide-y divide-border">
                  {record.data.timeline.map((t) => (
                    <li key={t.year} className="flex gap-4 px-4 py-3 sm:px-5">
                      <span className="w-14 shrink-0 text-sm font-semibold tabular-nums text-primary">
                        {t.year}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.label}</p>
                        <p className="text-xs text-muted-foreground">{t.note}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          )}
        </div>
      )}
    </>
  );
}
