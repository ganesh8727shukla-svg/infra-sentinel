import { createFileRoute, Link } from "@tanstack/react-router";
import { Satellite, Wrench } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { MetaItem, Section } from "@/components/ui/section";
import { ScoreMeter } from "@/components/ui/score-meter";
import { StatePill, StatusBadge } from "@/components/ui/status-badge";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/states";
import { MapPanel } from "@/components/maps/MapPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAsset,
  useDetections,
  useMaintenance,
  useRisk,
  useWorkOrders,
} from "@/hooks/useInfraData";
import {
  formatDate,
  formatDateTime,
  healthLevel,
  riskLevel,
} from "@/utils/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/assets/$assetId")({
  head: () =>
    seo(
      "Asset detail",
      "Health, risk factors, AI detections and maintenance history for a single asset.",
    ),
  component: AssetDetailPage,
});

function AssetDetailPage() {
  const { assetId } = Route.useParams();
  const asset = useAsset(assetId);
  const risk = useRisk(assetId);
  const detections = useDetections(assetId);
  const maintenance = useMaintenance(assetId);
  const workOrders = useWorkOrders();

  if (asset.isError) {
    return <ErrorState onRetry={() => void asset.refetch()} />;
  }

  if (asset.isLoading || !asset.data) {
    return <TableSkeleton rows={5} cols={3} />;
  }

  const a = asset.data;
  const relatedOrders = (workOrders.data ?? []).filter(
    (w) => w.assetId === a.id,
  );

  return (
    <>
      <PageHeader
        title={a.name}
        subtitle={`${a.type} · ${a.location} · ${a.assetCode}`}
        crumbs={[
          { label: "Admin", to: "/admin/dashboard" },
          { label: "Infrastructure", to: "/admin/assets" },
          { label: a.assetCode },
        ]}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/satellite">
                <Satellite className="size-4" aria-hidden="true" />
                Satellite view
              </Link>
            </Button>

            <Button asChild>
              <Link to="/admin/work-orders">
                <Wrench className="size-4" aria-hidden="true" />
                Work orders
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <Section
          title="Condition"
          className="xl:col-span-1"
          bodyClassName="space-y-5"
        >
          <div className="flex flex-wrap justify-around gap-4">
            <ScoreMeter
              value={a.healthScore}
              level={healthLevel(a.healthScore)}
              label="Health score"
            />

            <ScoreMeter
              value={a.riskScore}
              level={riskLevel(a.riskScore)}
              label="Risk score"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatePill>{a.status}</StatePill>
            <StatusBadge level={riskLevel(a.riskScore)} />
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <MetaItem label="District" value={a.district} />
            <MetaItem label="Built" value={a.constructionYear} />
            <MetaItem label="Length" value={`${a.lengthKm} km`} />
            <MetaItem label="Project cost" value={a.projectCost} />
            <MetaItem label="Contractor" value={a.contractorId} />
            <MetaItem
              label="Last inspection"
              value={formatDate(a.lastInspection)}
            />
          </dl>
        </Section>

        <Section
          title="Location"
          className="xl:col-span-2"
          bodyClassName="space-y-3"
        >
          <MapPanel assets={[a]} height={360} compact />

          <p className="text-xs text-muted-foreground">
            {a.latitude.toFixed(4)}, {a.longitude.toFixed(4)}
          </p>
        </Section>
      </div>

      <Section className="mt-5" bodyClassName="p-0 sm:p-0">
        <Tabs defaultValue="risk">
          <TabsList className="m-4 mb-0 sm:m-5 sm:mb-0">
            <TabsTrigger value="risk">Risk factors</TabsTrigger>
            <TabsTrigger value="detections">AI detections</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="orders">Work orders</TabsTrigger>
          </TabsList>

          <TabsContent value="risk" className="p-4 sm:p-5">
            {risk.data ? (
              <div className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
                  <div className="rounded-xl border border-border bg-muted/20 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Overall risk
                        </p>

                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-4xl font-semibold tracking-tight text-foreground">
                            {risk.data.score}
                          </span>

                          <span className="text-sm text-muted-foreground">
                            / 100
                          </span>
                        </div>
                      </div>

                      <StatusBadge level={risk.data.level} />
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${Math.min(risk.data.score, 100)}%`,
                        }}
                      />
                    </div>

                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      Risk is calculated from AI evidence, detected defects,
                      complaint volume, and asset age.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          Risk contribution
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Transparent breakdown of the current assessment.
                        </p>
                      </div>

                      <StatePill>Calculated</StatePill>
                    </div>

                    <div className="mt-5 space-y-4">
                      {risk.data.factors.map((factor) => {
                        const percentage =
                          factor.maxScore > 0
                            ? Math.min(
                                (factor.score / factor.maxScore) * 100,
                                100,
                              )
                            : 0;

                        return (
                          <div key={factor.key} className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm font-medium text-foreground">
                                {factor.label}
                              </span>

                              <span className="text-xs font-medium text-muted-foreground">
                                {factor.score} / {factor.maxScore}
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Assessment factors
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Evidence used by the automated risk engine.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {risk.data.factors.map((factor) => (
                      <div
                        key={factor.key}
                        className="rounded-xl border border-border p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium text-foreground">
                            {factor.label}
                          </p>

                          <span className="text-xs font-semibold text-muted-foreground">
                            +{factor.score}
                          </span>
                        </div>

                        <p className="mt-2 text-lg font-semibold text-foreground">
                          {factor.value}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Maximum contribution: {factor.maxScore}
                        </p>

                        {factor.key === "aiEvidence" && (
                          <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                            <p>
                              Confidence:{" "}
                              <span className="font-medium text-foreground">
                                {factor.details["confidence"]}%
                              </span>
                            </p>

                            <p>
                              Severity:{" "}
                              <span className="font-medium capitalize text-foreground">
                                {factor.details["severity"]}
                              </span>
                            </p>

                            {factor.details["sourceComplaintId"] && (
                              <p>
                                Source complaint:{" "}
                                <span className="font-medium text-foreground">
                                  {factor.details["sourceComplaintId"]}
                                </span>
                              </p>
                            )}
                          </div>
                        )}

                        {factor.key === "detectedDefects" && (
                          <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                            {factor.details["detections"]} computer-vision
                            detections contributed to the score.
                          </p>
                        )}

                        {factor.key === "complaintVolume" && (
                          <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                            {factor.details["complaints"]} citizen complaint
                            {factor.details["complaints"] === 1 ? "" : "s"}{" "}
                            associated with this asset.
                          </p>
                        )}

                        {factor.key === "assetAge" && (
                          <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                            Asset age contributes up to {factor.maxScore}{" "}
                            points to lifecycle risk.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-5">
                  <h3 className="text-sm font-semibold text-foreground">
                    Why this risk level?
                  </h3>

                  <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
                    The asset is currently classified as{" "}
                    <span className="font-semibold capitalize text-foreground">
                      {risk.data.level}
                    </span>{" "}
                    risk because the automated assessment combines
                    AI-detected infrastructure defects with their confidence
                    and severity, reported complaint volume, and the age of the
                    asset.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatePill>
                      AI evidence{" "}
                      {risk.data.factors.find(
                        (f) => f.key === "aiEvidence",
                      )?.score ?? 0}
                      /50
                    </StatePill>

                    <StatePill>
                      Defects{" "}
                      {risk.data.factors.find(
                        (f) => f.key === "detectedDefects",
                      )?.score ?? 0}
                      /20
                    </StatePill>

                    <StatePill>
                      Complaints{" "}
                      {risk.data.factors.find(
                        (f) => f.key === "complaintVolume",
                      )?.score ?? 0}
                      /15
                    </StatePill>

                    <StatePill>
                      Age{" "}
                      {risk.data.factors.find(
                        (f) => f.key === "assetAge",
                      )?.score ?? 0}
                      /15
                    </StatePill>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Last calculated {formatDateTime(risk.data.calculatedAt)}
                </p>
              </div>
            ) : (
              <TableSkeleton rows={4} cols={2} />
            )}
          </TabsContent>

          <TabsContent value="detections" className="p-4 sm:p-5">
            {(detections.data ?? []).length === 0 ? (
              <EmptyState
                title="No AI detections"
                description="No computer-vision detections have been recorded for this asset."
              />
            ) : (
              <ul className="space-y-2">
                {(detections.data ?? []).map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {d.detectionType}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(d.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatePill>{d.confidence}% confidence</StatePill>
                      <StatusBadge level={d.severity} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="maintenance" className="p-4 sm:p-5">
            {(maintenance.data ?? []).length === 0 ? (
              <EmptyState
                title="No maintenance history"
                description="Inspections and repairs will appear here once recorded."
              />
            ) : (
              <ul className="space-y-2">
                {(maintenance.data ?? []).map((m, i) => (
                  <li
                    key={`${m.date}-${i}`}
                    className="rounded-lg border border-border p-3"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {m.type} · {formatDate(m.date)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {m.detail}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="orders" className="p-4 sm:p-5">
            {relatedOrders.length === 0 ? (
              <EmptyState
                title="No work orders"
                description="No maintenance work has been raised against this asset."
              />
            ) : (
              <ul className="space-y-2">
                {relatedOrders.map((w) => (
                  <li
                    key={w.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                  >
                    <div>
                      <Link
                        to="/admin/work-orders/$workOrderId"
                        params={{ workOrderId: w.id }}
                        className="text-sm font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {w.id} · {w.issue}
                      </Link>

                      <p className="text-xs text-muted-foreground">
                        Due {formatDate(w.deadline)}
                      </p>
                    </div>

                    <StatePill>{w.status}</StatePill>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </Section>
    </>
  );
}