import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { MetaItem, Section } from "@/components/ui/section";
import { StatePill, StatusBadge } from "@/components/ui/status-badge";
import { ErrorState, TableSkeleton } from "@/components/ui/states";
import { LifecycleTimeline } from "@/components/workorders/LifecycleTimeline";
import type { LifecycleStep, StepState } from "@/components/workorders/LifecycleTimeline";
import { Button } from "@/components/ui/button";
import { useComplaint } from "@/hooks/useInfraData";
import { formatDateTime, riskLevel } from "@/utils/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/complaints/$complaintId")({
  head: () =>
    seo("Complaint detail", "Citizen report with AI analysis, assigned risk and generated work order."),
  component: ComplaintDetailPage,
});

const STAGES = ["Reported", "AI Analysed", "Risk Assigned", "Work Order Created", "Resolved"];

function ComplaintDetailPage() {
  const { complaintId } = Route.useParams();
  const complaint = useComplaint(complaintId);

  if (complaint.isError) return <ErrorState onRetry={() => void complaint.refetch()} />;
  if (complaint.isLoading || !complaint.data) return <TableSkeleton rows={4} cols={3} />;

  const c = complaint.data;
  const currentIndex = Math.max(0, STAGES.indexOf(c.status === "Rejected" ? "Reported" : c.status));
  const steps: LifecycleStep[] = STAGES.map((label, i) => {
    const state: StepState = i < currentIndex ? "done" : i === currentIndex ? "current" : "todo";
    return { label, state };
  });

  return (
    <>
      <PageHeader
        title={`Complaint ${c.id}`}
        subtitle={`${c.issueType} reported on ${c.assetId}`}
        crumbs={[
          { label: "Admin", to: "/admin/dashboard" },
          { label: "Complaints", to: "/admin/complaints" },
          { label: c.id },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/assets/$assetId" params={{ assetId: c.assetId }}>
              View asset
            </Link>
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <Section title="Report" className="xl:col-span-2" bodyClassName="space-y-4">
          <p className="text-sm text-foreground">{c.description}</p>
          <dl className="grid gap-4 sm:grid-cols-3">
            <MetaItem label="Issue type" value={c.issueType} />
            <MetaItem label="Submitted by" value={c.submittedBy} />
            <MetaItem label="Submitted at" value={formatDateTime(c.createdAt)} />
            <MetaItem label="Citizen ID" value={c.citizenId} />
            <MetaItem
              label="Coordinates"
              value={`${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}`}
            />
            <MetaItem label="AI status" value={<StatePill>{c.aiStatus}</StatePill>} />
          </dl>
          <div className="flex flex-wrap items-center gap-2">
            <StatePill>{c.status}</StatePill>
            {c.riskScore !== null && (
              <StatusBadge level={riskLevel(c.riskScore)} label={`Risk ${c.riskScore}`} />
            )}
            {c.workOrderId && (
              <Button size="sm" variant="ghost" asChild>
                <Link to="/admin/work-orders/$workOrderId" params={{ workOrderId: c.workOrderId }}>
                  {c.workOrderId}
                </Link>
              </Button>
            )}
          </div>
        </Section>

        <Section title="Pipeline progress">
          <LifecycleTimeline steps={steps} />
        </Section>
      </div>
    </>
  );
}
