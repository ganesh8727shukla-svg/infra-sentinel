import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { MetaItem, Section } from "@/components/ui/section";
import { StatePill, StatusBadge } from "@/components/ui/status-badge";
import { ErrorState, TableSkeleton } from "@/components/ui/states";
import { LifecycleTimeline } from "@/components/workorders/LifecycleTimeline";
import type { LifecycleStep, StepState } from "@/components/workorders/LifecycleTimeline";
import { Button } from "@/components/ui/button";
import { useWorkOrder } from "@/hooks/useInfraData";
import { formatDate, formatDateTime, riskLevel } from "@/utils/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/work-orders/$workOrderId")({
  head: () =>
    seo("Work order detail", "Lifecycle, assignment and AI verification state for a maintenance work order."),
  component: WorkOrderDetailPage,
});

const STAGES = ["Pending", "Assigned", "In Progress", "Verification", "Completed"];

function WorkOrderDetailPage() {
  const { workOrderId } = Route.useParams();
  const order = useWorkOrder(workOrderId);

  if (order.isError) return <ErrorState onRetry={() => void order.refetch()} />;
  if (order.isLoading || !order.data) return <TableSkeleton rows={4} cols={3} />;

  const w = order.data;
  const idx = Math.max(0, STAGES.indexOf(w.status === "Exception Review" ? "Verification" : w.status));
  const steps: LifecycleStep[] = STAGES.map((label, i) => {
    const state: StepState = i < idx ? "done" : i === idx ? "current" : "todo";
    return { label, state };
  });

  return (
    <>
      <PageHeader
        title={`Work order ${w.id}`}
        subtitle={`${w.issue} · ${w.requiredAction}`}
        crumbs={[
          { label: "Admin", to: "/admin/dashboard" },
          { label: "Work Orders", to: "/admin/work-orders" },
          { label: w.id },
        ]}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/assets/$assetId" params={{ assetId: w.assetId }}>
                View asset
              </Link>
            </Button>
            <Button asChild>
              <Link to="/contractor/orders/$workOrderId" params={{ workOrderId: w.id }}>
                Contractor view
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <Section title="Order details" className="xl:col-span-2" bodyClassName="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-3">
            <MetaItem label="Asset" value={w.assetId} />
            <MetaItem
              label="Contractor"
              value={
                <Link
                  to="/admin/contractors/$contractorId"
                  params={{ contractorId: w.contractorId }}
                  className="text-primary hover:underline"
                >
                  {w.contractorId}
                </Link>
              }
            />
            <MetaItem label="Priority" value={<StatePill>{w.priority}</StatePill>} />
            <MetaItem label="Created" value={formatDateTime(w.createdAt)} />
            <MetaItem label="Deadline" value={formatDate(w.deadline)} />
            <MetaItem
              label="Risk"
              value={<StatusBadge level={riskLevel(w.riskScore)} label={String(w.riskScore)} />}
            />
            <MetaItem label="Status" value={<StatePill>{w.status}</StatePill>} />
            <MetaItem label="Verification" value={w.verificationStatus} />
            <MetaItem
              label="Confidence"
              value={w.verificationConfidence ? `${w.verificationConfidence}%` : "—"}
            />
          </dl>
          {w.notes && (
            <p className="text-sm text-foreground">
              <span className="text-muted-foreground">Contractor notes: </span>
              {w.notes}
            </p>
          )}
          {w.complaintId && (
            <p className="text-sm">
              <span className="text-muted-foreground">Originating complaint: </span>
              <Link
                to="/admin/complaints/$complaintId"
                params={{ complaintId: w.complaintId }}
                className="text-primary hover:underline"
              >
                {w.complaintId}
              </Link>
            </p>
          )}
        </Section>

        <Section title="Lifecycle">
          <LifecycleTimeline steps={steps} />
        </Section>
      </div>

      <Section className="mt-5" title="Repair evidence" description="Before and after imagery used by the verification engine.">
        <div className="grid gap-4 sm:grid-cols-2">
          {(["beforeImage", "afterImage"] as const).map((key) => (
            <figure key={key} className="rounded-lg border border-border p-3">
              <figcaption className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {key === "beforeImage" ? "Before" : "After"}
              </figcaption>
              {w[key] ? (
                <img
                  src={w[key]}
                  alt={`${key === "beforeImage" ? "Before" : "After"} repair evidence for ${w.id}`}
                  className="h-48 w-full rounded-md object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-48 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                  Not submitted
                </div>
              )}
            </figure>
          ))}
        </div>
      </Section>
    </>
  );
}
