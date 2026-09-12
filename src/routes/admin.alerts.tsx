import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { StatePill, StatusBadge } from "@/components/ui/status-badge";
import { ScoreBar } from "@/components/ui/score-meter";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { useAlerts } from "@/hooks/useInfraData";
import { formatDateTime, riskLevel, timeAgo } from "@/utils/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/alerts")({
  head: () =>
    seo("Risk & alerts", "Automated risk alerts with AI confidence, recommended action and resolution status."),
  component: AlertsPage,
});

function AlertsPage() {
  const alerts = useAlerts();
  const [showResolved, setShowResolved] = useState(false);

  const rows = (alerts.data ?? []).filter((a) => showResolved || !a.resolved);

  return (
    <>
      <PageHeader
        title="Risk & alerts"
        subtitle="Every alert raised by the automated risk engine, newest first."
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Risk & Alerts" }]}
        actions={
          <Button variant="outline" onClick={() => setShowResolved((v) => !v)} aria-pressed={showResolved}>
            {showResolved ? "Hide resolved" : "Show resolved"}
          </Button>
        }
      />

      {alerts.isError ? (
        <ErrorState onRetry={() => void alerts.refetch()} />
      ) : alerts.isLoading ? (
        <TableSkeleton rows={6} cols={3} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No active alerts"
          description="The network is currently operating without unresolved risk alerts."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((a) => (
            <Section key={a.id} bodyClassName="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-foreground">{a.issue}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.id} · {a.assetId} · {timeAgo(a.createdAt)}
                  </p>
                </div>
                <StatusBadge level={a.level} />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Risk score</p>
                  <ScoreBar value={a.riskScore} level={riskLevel(a.riskScore)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">AI confidence</p>
                  <p className="text-sm font-medium text-foreground">{a.aiConfidence}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Raised</p>
                  <p className="text-sm font-medium text-foreground">{formatDateTime(a.createdAt)}</p>
                </div>
              </div>

              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">Recommended action: </span>
                {a.recommendedAction}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <StatePill>{a.resolved ? "Resolved" : "Open"}</StatePill>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/admin/assets/$assetId" params={{ assetId: a.assetId }}>
                    Inspect asset
                  </Link>
                </Button>
                {a.workOrderId && (
                  <Button size="sm" variant="ghost" asChild>
                    <Link to="/admin/work-orders/$workOrderId" params={{ workOrderId: a.workOrderId }}>
                      {a.workOrderId}
                    </Link>
                  </Button>
                )}
              </div>
            </Section>
          ))}
        </div>
      )}
    </>
  );
}
