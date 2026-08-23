import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Building2,
  ClipboardList,
  ShieldAlert,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { KPICard } from "@/components/dashboard/KPICard";
import { Section } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScoreBar } from "@/components/ui/score-meter";
import { CardSkeleton, ErrorState, TableSkeleton } from "@/components/ui/states";
import { MapLegend, MapPanel } from "@/components/maps/MapPanel";
import { Button } from "@/components/ui/button";
import { useAlerts, useAssets, useOverview, useWorkOrders } from "@/hooks/useInfraData";
import { formatDate, greeting, riskLevel, timeAgo } from "@/utils/format";
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

  const criticalAlerts = (alerts.data ?? []).filter((a) => !a.resolved).slice(0, 5);
  const recentOrders = (workOrders.data ?? []).slice(0, 5);

  return (
    <>
      <PageHeader
        title="Infrastructure command centre"
        subtitle={`${greeting()}. Network-wide health, risk and execution at a glance.`}
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Dashboard" }]}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/alerts">
                <TriangleAlert className="size-4" aria-hidden="true" />
                Risk & alerts
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

      {overview.isError ? (
        <ErrorState onRetry={() => void overview.refetch()} />
      ) : overview.isLoading || !overview.data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KPICard
            label="Total assets monitored"
            value={overview.data.totalAssets}
            support="Across 6 districts"
            trend={{ direction: "up", value: overview.data.totalTrend }}
            icon={Building2}
          />
          <KPICard
            label="Healthy assets"
            value={overview.data.healthy}
            support={overview.data.healthyPct}
            tone="healthy"
            icon={Activity}
          />
          <KPICard
            label="High risk"
            value={overview.data.highRisk}
            support={overview.data.highRiskPct}
            tone="high"
            icon={TriangleAlert}
          />
          <KPICard
            label="Critical"
            value={overview.data.critical}
            support={overview.data.criticalPct}
            tone="critical"
            icon={ShieldAlert}
          />
        </div>
      )}

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Section
          className="xl:col-span-2"
          title="Geospatial risk overview"
          description="District clusters coloured by current risk level."
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/map">Open full map</Link>
            </Button>
          }
          bodyClassName="space-y-3"
        >
          <MapPanel assets={assets.data ?? []} height={420} />
          <MapLegend />
        </Section>

        <Section
          title="Critical alerts"
          description="Unresolved, ordered by risk."
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/alerts">View all</Link>
            </Button>
          }
          bodyClassName="space-y-3"
        >
          {alerts.isLoading ? (
            <TableSkeleton rows={4} cols={1} />
          ) : criticalAlerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No unresolved alerts.</p>
          ) : (
            criticalAlerts.map((a) => (
              <article key={a.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{a.issue}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.assetId} · {timeAgo(a.createdAt)}
                    </p>
                  </div>
                  <StatusBadge level={a.level} />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <ScoreBar value={a.riskScore} level={riskLevel(a.riskScore)} />
                  <Link
                    to="/admin/assets/$assetId"
                    params={{ assetId: a.assetId }}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Inspect asset
                  </Link>
                </div>
              </article>
            ))
          )}
        </Section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Section
          title="Recent work orders"
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/work-orders">All orders</Link>
            </Button>
          }
          bodyClassName="p-0 sm:p-0"
        >
          <ul className="divide-y divide-border">
            {recentOrders.map((w) => (
              <li key={w.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <Link
                    to="/admin/work-orders/$workOrderId"
                    params={{ workOrderId: w.id }}
                    className="text-sm font-medium text-foreground hover:text-primary hover:underline"
                  >
                    {w.id} · {w.issue}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {w.assetId} · due {formatDate(w.deadline)}
                  </p>
                </div>
                <StatusBadge level={riskLevel(w.riskScore)} label={w.status} />
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Citizen participation"
          description="Reports feeding the automated pipeline."
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/complaints">
                <ClipboardList className="size-4" aria-hidden="true" />
                Complaints
              </Link>
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-2xl font-semibold tabular-nums text-foreground">
                {overview.data?.activeWorkOrders ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">Active work orders</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums text-foreground">
                {overview.data?.pendingVerification ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">Pending verification</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums text-foreground">
                {(assets.data ?? []).length}
              </p>
              <p className="text-xs text-muted-foreground">Assets in registry</p>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
