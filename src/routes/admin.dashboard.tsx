import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock3,
  MapPinned,
  ShieldAlert,
  TriangleAlert,
  Wrench,
} from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { KPICard } from "@/components/dashboard/KPICard";
import { Section } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScoreBar } from "@/components/ui/score-meter";
import {
  CardSkeleton,
  ErrorState,
  TableSkeleton,
} from "@/components/ui/states";
import { MapLegend, MapPanel } from "@/components/maps/MapPanel";
import { Button } from "@/components/ui/button";

import {
  useAlerts,
  useAssets,
  useOverview,
  useWorkOrders,
} from "@/hooks/useInfraData";

import {
  formatDate,
  greeting,
  riskLevel,
  timeAgo,
} from "@/utils/format";

import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/dashboard")({
  head: () =>
    seo(
      "Command centre dashboard",
      "Live infrastructure health, critical risk alerts and active work orders across the network.",
    ),
  component: DashboardPage,
});

function DashboardPage() {
  const overview = useOverview();
  const assets = useAssets();
  const alerts = useAlerts();
  const workOrders = useWorkOrders();

  const assetList = assets.data ?? [];
  const alertList = alerts.data ?? [];
  const workOrderList = workOrders.data ?? [];

  /*
   * ---------------------------------------------------------------
   * NETWORK RISK
   * ---------------------------------------------------------------
   * Always calculated from the actual asset registry.
   * No dashboard percentages or category totals are hardcoded.
   */
  const riskDistribution = assetList.reduce(
    (acc, asset) => {
      const level = riskLevel(asset.riskScore);

      if (level === "healthy") {
        acc.healthy += 1;
      } else if (level === "moderate") {
        acc.moderate += 1;
      } else if (level === "high") {
        acc.high += 1;
      } else if (level === "critical") {
        acc.critical += 1;
      }

      return acc;
    },
    {
      healthy: 0,
      moderate: 0,
      high: 0,
      critical: 0,
    },
  );

  const totalAssets = assetList.length;

  const districtCount = new Set(
    assetList
      .map((asset) => asset.district)
      .filter(Boolean),
  ).size;

  const atRiskCount =
    riskDistribution.high + riskDistribution.critical;

  const healthyPercentage =
    totalAssets > 0
      ? Math.round((riskDistribution.healthy / totalAssets) * 100)
      : 0;

  const atRiskPercentage =
    totalAssets > 0
      ? Math.round((atRiskCount / totalAssets) * 100)
      : 0;

  /*
   * ---------------------------------------------------------------
   * ALERTS
   * ---------------------------------------------------------------
   */
  const unresolvedAlerts = alertList
    .filter((alert) => !alert.resolved)
    .sort((a, b) => b.riskScore - a.riskScore);

  const priorityAlerts = unresolvedAlerts.slice(0, 5);

  /*
   * ---------------------------------------------------------------
   * WORK ORDERS
   * ---------------------------------------------------------------
   */
  const recentOrders = [...workOrderList]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const activeWorkOrders =
    overview.data?.activeWorkOrders ??
    workOrderList.filter(
      (order) =>
        order.status !== "Completed" &&
        order.status !== "Exception Review",
    ).length;

  const pendingVerification =
    overview.data?.pendingVerification ??
    workOrderList.filter(
      (order) =>
        order.verificationStatus === "Analysing" ||
        order.verificationStatus === "Not started",
    ).length;

  /*
   * ---------------------------------------------------------------
   * ERROR STATES
   * ---------------------------------------------------------------
   */
  const dashboardError =
    overview.isError &&
    assets.isError &&
    alerts.isError &&
    workOrders.isError;

  /*
   * ---------------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------------
   */
  return (
    <>
      <PageHeader
        title="Infrastructure command centre"
        subtitle={`${greeting()}. Monitor network condition, prioritise risk and track execution.`}
        crumbs={[
          {
            label: "Admin",
            to: "/admin/dashboard",
          },
          {
            label: "Dashboard",
          },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/map">
                <MapPinned className="size-4" aria-hidden="true" />
                Network map
              </Link>
            </Button>

            <Button asChild>
              <Link to="/admin/work-orders">
                <Wrench className="size-4" aria-hidden="true" />
                Work orders
              </Link>
            </Button>
          </div>
        }
      />

      {dashboardError ? (
        <ErrorState
          onRetry={() => {
            void overview.refetch();
            void assets.refetch();
            void alerts.refetch();
            void workOrders.refetch();
          }}
        />
      ) : (
        <>
          {/* ========================================================
              NETWORK HEALTH
             ======================================================== */}

          {overview.isLoading || assets.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KPICard
                label="Assets monitored"
                value={totalAssets}
                support={
                  districtCount > 0
                    ? `${districtCount} districts covered`
                    : "Live infrastructure registry"
                }
                icon={Building2}
              />

              <KPICard
                label="Healthy"
                value={riskDistribution.healthy}
                support={`${healthyPercentage}% of monitored assets`}
                tone="healthy"
                icon={Activity}
              />

              <KPICard
                label="At risk"
                value={atRiskCount}
                support={
                  atRiskCount > 0
                    ? `${atRiskPercentage}% high or critical`
                    : "No high-risk assets"
                }
                tone="high"
                icon={TriangleAlert}
              />

              <KPICard
                label="Critical"
                value={riskDistribution.critical}
                support={
                  riskDistribution.critical > 0
                    ? "Priority intervention required"
                    : "No critical assets"
                }
                tone="critical"
                icon={ShieldAlert}
              />
            </div>
          )}

          {/* ========================================================
              NETWORK POSTURE
             ======================================================== */}

          {!assets.isLoading && !assets.isError && (
            <section className="mt-5 rounded-xl border border-border bg-card">
              <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Network posture
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Current condition across the infrastructure registry.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
                  <RiskSummary
                    label="Healthy"
                    value={riskDistribution.healthy}
                    total={totalAssets}
                    level="healthy"
                  />

                  <RiskSummary
                    label="Moderate"
                    value={riskDistribution.moderate}
                    total={totalAssets}
                    level="moderate"
                  />

                  <RiskSummary
                    label="High"
                    value={riskDistribution.high}
                    total={totalAssets}
                    level="high"
                  />

                  <RiskSummary
                    label="Critical"
                    value={riskDistribution.critical}
                    total={totalAssets}
                    level="critical"
                  />
                </div>
              </div>
            </section>
          )}

          {/* ========================================================
              MAP + PRIORITY ALERTS
             ======================================================== */}

          <div className="mt-5 grid gap-5 xl:grid-cols-3">
            <Section
              className="xl:col-span-2"
              title="Network risk map"
              description={
                districtCount > 0
                  ? `Live asset condition across ${districtCount} monitored districts.`
                  : "Live condition of assets in the monitored network."
              }
              actions={
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/map">
                    <MapPinned className="size-4" aria-hidden="true" />
                    Full map
                  </Link>
                </Button>
              }
              bodyClassName="space-y-3"
            >
              {assets.isError ? (
                <ErrorState onRetry={() => void assets.refetch()} />
              ) : assets.isLoading ? (
                <TableSkeleton rows={4} cols={1} />
              ) : assetList.length === 0 ? (
                <EmptyNetworkState />
              ) : (
                <>
                  <MapPanel assets={assetList} height={420} />
                  <MapLegend />
                </>
              )}
            </Section>

            <Section
              title="Priority alerts"
              description={
                unresolvedAlerts.length > 0
                  ? `${unresolvedAlerts.length} unresolved risk alert${
                      unresolvedAlerts.length === 1 ? "" : "s"
                    }.`
                  : "No unresolved automated risk alerts."
              }
              actions={
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/alerts">View all</Link>
                </Button>
              }
              bodyClassName="space-y-3"
            >
              {alerts.isError ? (
                <ErrorState onRetry={() => void alerts.refetch()} />
              ) : alerts.isLoading ? (
                <TableSkeleton rows={4} cols={1} />
              ) : priorityAlerts.length === 0 ? (
                <NoAlertsState />
              ) : (
                <div className="space-y-3">
                  {priorityAlerts.map((alert) => (
                    <article
                      key={alert.id}
                      className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {alert.issue}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {alert.assetId} · {timeAgo(alert.createdAt)}
                          </p>
                        </div>

                        <StatusBadge level={alert.level} />
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <ScoreBar
                            value={alert.riskScore}
                            level={riskLevel(alert.riskScore)}
                          />
                        </div>

                        <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                          {alert.riskScore.toFixed(2)}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-muted-foreground">
                          AI confidence{" "}
                          {typeof alert.aiConfidence === "number"
                            ? `${alert.aiConfidence.toFixed(1)}%`
                            : "—"}
                        </span>

                        <Link
                          to="/admin/assets/$assetId"
                          params={{
                            assetId: alert.assetId,
                          }}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Inspect asset
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* ========================================================
              EXECUTION PIPELINE
             ======================================================== */}

          <div className="mt-5 grid gap-5 xl:grid-cols-3">
            <Section
              className="xl:col-span-2"
              title="Execution pipeline"
              description="Latest maintenance actions and their current lifecycle state."
              actions={
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/work-orders">View all</Link>
                </Button>
              }
              bodyClassName="p-0 sm:p-0"
            >
              {workOrders.isError ? (
                <div className="p-5">
                  <ErrorState
                    onRetry={() => void workOrders.refetch()}
                  />
                </div>
              ) : workOrders.isLoading ? (
                <div className="p-5">
                  <TableSkeleton rows={5} cols={1} />
                </div>
              ) : recentOrders.length === 0 ? (
                <EmptyWorkOrdersState />
              ) : (
                <ul className="divide-y divide-border">
                  {recentOrders.map((workOrder) => (
                    <li
                      key={workOrder.id}
                      className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-muted/30 sm:px-5"
                    >
                      <div className="min-w-0">
                        <Link
                          to="/admin/work-orders/$workOrderId"
                          params={{
                            workOrderId: workOrder.id,
                          }}
                          className="block truncate text-sm font-medium text-foreground hover:text-primary hover:underline"
                        >
                          {workOrder.issue}
                        </Link>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                          <span>{workOrder.id}</span>
                          <span>·</span>
                          <span>{workOrder.assetId}</span>

                          {workOrder.contractorId && (
                            <>
                              <span>·</span>
                              <span>{workOrder.contractorId}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <StatusBadge
                          level={riskLevel(workOrder.riskScore)}
                          label={workOrder.status}
                        />

                        <span className="text-[11px] text-muted-foreground">
                          Due {formatDate(workOrder.deadline)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            {/* ======================================================
                OPERATIONS
               ====================================================== */}

            <Section
              title="Operations"
              description="Current workload requiring attention."
              actions={
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/work-orders">Manage</Link>
                </Button>
              }
              bodyClassName="space-y-3"
            >
              <MetricRow
                icon={Wrench}
                label="Active work orders"
                value={activeWorkOrders}
                description="Currently in execution"
              />

              <MetricRow
                icon={Clock3}
                label="Awaiting verification"
                value={pendingVerification}
                description="Repair evidence requiring analysis"
              />

              <MetricRow
                icon={TriangleAlert}
                label="Open alerts"
                value={unresolvedAlerts.length}
                description="Automated risk alerts"
              />

              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  {riskDistribution.critical > 0 ? (
                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {riskDistribution.critical > 0
                        ? "Priority intervention required"
                        : "Network condition is stable"}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {riskDistribution.critical > 0
                        ? `${riskDistribution.critical} asset${
                            riskDistribution.critical === 1 ? "" : "s"
                          } currently fall in the critical risk band.`
                        : "No infrastructure asset is currently classified as critical."}
                    </p>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </>
      )}
    </>
  );
}

/* ================================================================
   RISK SUMMARY
   ================================================================ */

function RiskSummary({
  label,
  value,
  total,
  level,
}: {
  label: string;
  value: number;
  total: number;
  level: "healthy" | "moderate" | "high" | "critical";
}) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  const dotClass = {
    healthy: "bg-emerald-600",
    moderate: "bg-amber-500",
    high: "bg-orange-600",
    critical: "bg-red-600",
  }[level];

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={`size-2 shrink-0 rounded-full ${dotClass}`}
        aria-hidden="true"
      />

      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="font-semibold tabular-nums text-foreground">
        {value}
      </span>

      <span className="text-xs text-muted-foreground">
        {percentage}%
      </span>
    </div>
  );
}

/* ================================================================
   OPERATIONS METRIC
   ================================================================ */

function MetricRow({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof Wrench;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {label}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      <span className="text-xl font-semibold tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}

/* ================================================================
   EMPTY STATES
   ================================================================ */

function EmptyNetworkState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border">
      <div className="text-center">
        <Building2 className="mx-auto size-8 text-muted-foreground" />

        <p className="mt-3 text-sm font-medium text-foreground">
          No infrastructure assets available
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Assets will appear here once they are added to the registry.
        </p>
      </div>
    </div>
  );
}

function NoAlertsState() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-border px-5 text-center">
      <CheckCircle2 className="size-8 text-emerald-600" />

      <p className="mt-3 text-sm font-medium text-foreground">
        No unresolved alerts
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        The network currently has no open automated risk alerts.
      </p>
    </div>
  );
}

function EmptyWorkOrdersState() {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="text-center">
        <Wrench className="mx-auto size-8 text-muted-foreground" />

        <p className="mt-3 text-sm font-medium text-foreground">
          No work orders yet
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Maintenance orders will appear when risk assessments
          trigger intervention.
        </p>
      </div>
    </div>
  );
}