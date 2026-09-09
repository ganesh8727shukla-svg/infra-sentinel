import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, ClipboardList, ShieldCheck, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { StatePill, StatusBadge } from "@/components/ui/status-badge";
import { CardSkeleton, ErrorState } from "@/components/ui/states";
import { MapPanel, MapLegend } from "@/components/maps/MapPanel";
import { useAssets, useComplaints } from "@/hooks/useInfraData";
import { greeting, riskLevel, timeAgo } from "@/utils/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/citizen/")({
  head: () =>
    seo(
      "Citizen home",
      "Report infrastructure issues, follow AI analysis and track repair verification in your area.",
    ),
  component: CitizenHome,
});

function CitizenHome() {
  const complaints = useComplaints();
  const assets = useAssets();

  if (complaints.isError || assets.isError) {
    return (
      <ErrorState
        onRetry={() => {
          void complaints.refetch();
          void assets.refetch();
        }}
      />
    );
  }

  const mine = complaints.data ?? [];
  const resolved = mine.filter((c) => c.status === "Resolved").length;
  const inProgress = mine.length - resolved;
  const nearby = (assets.data ?? []).slice(0, 12);

  return (
    <div className="space-y-5">
      <section className="rounded-xl bg-navy px-4 py-5 text-navy-foreground">
        <p className="text-xs text-navy-foreground/70">{greeting()}</p>

        <h1 className="mt-1 text-xl font-semibold">
          Help keep your roads safe
        </h1>

        <p className="mt-1 text-[13px] text-navy-foreground/80">
          Every report is analysed by AI, scored for risk and tracked to
          verified repair.
        </p>

        <Button asChild className="mt-4 w-full sm:w-auto">
          <Link to="/citizen/report">
            <Camera className="size-4" aria-hidden="true" />
            Report an issue
          </Link>
        </Button>
      </section>

      <div className="grid grid-cols-3 gap-3">
        <StatTile
          icon={ClipboardList}
          label="My reports"
          value={mine.length}
        />

        <StatTile
          icon={ShieldCheck}
          label="Resolved"
          value={resolved}
        />

        <StatTile
          icon={TriangleAlert}
          label="In progress"
          value={inProgress}
        />
      </div>

      <Section
        title="Recent reports"
        description="Your submissions and their live lifecycle status."
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link to="/citizen/complaints">
              View all
            </Link>
          </Button>
        }
        bodyClassName="space-y-2"
      >
        {complaints.isLoading ? (
          <CardSkeleton />
        ) : mine.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You haven't reported anything yet. Your first report takes under a
            minute.
          </p>
        ) : (
          mine.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              to="/citizen/complaints/$complaintId"
              params={{ complaintId: c.id }}
              className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-accent/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {c.issueType}
                </p>

                <p className="text-xs text-muted-foreground">
                  {c.assetId} · {timeAgo(c.createdAt)}
                </p>
              </div>

              <div className="ml-auto flex shrink-0 items-center gap-2">
                {c.riskScore !== null && (
                  <StatusBadge
                    level={riskLevel(c.riskScore)}
                    label={`Risk ${c.riskScore}`}
                  />
                )}

                <StatePill>{c.status}</StatePill>
              </div>
            </Link>
          ))
        )}
      </Section>

      <Section
        title="Infrastructure near you"
        description="Live condition of assets in your district."
      >
        <MapPanel assets={nearby} height={280} compact />

        <div className="mt-3">
          <MapLegend />
        </div>
      </Section>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ClipboardList;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-3 text-center">
      <Icon
        className="mx-auto size-4 text-primary"
        aria-hidden="true"
      />

      <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
        {value}
      </p>

      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}