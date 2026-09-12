import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { MetaItem, Section } from "@/components/ui/section";
import { StatePill } from "@/components/ui/status-badge";
import { ScoreMeter } from "@/components/ui/score-meter";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/states";
import { useContractor, useWorkOrders } from "@/hooks/useInfraData";
import { formatDate, healthLevel } from "@/utils/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/contractors/$contractorId")({
  head: () => seo("Contractor profile", "Performance record and assigned work orders for an empanelled contractor."),
  component: ContractorDetailPage,
});

function ContractorDetailPage() {
  const { contractorId } = Route.useParams();
  const contractor = useContractor(contractorId);
  const workOrders = useWorkOrders();

  if (contractor.isError) return <ErrorState onRetry={() => void contractor.refetch()} />;
  if (contractor.isLoading || !contractor.data) return <TableSkeleton rows={4} cols={3} />;

  const c = contractor.data;
  const orders = (workOrders.data ?? []).filter((w) => w.contractorId === c.id);

  return (
    <>
      <PageHeader
        title={c.name}
        subtitle={`${c.id} · ${c.district} district`}
        crumbs={[
          { label: "Admin", to: "/admin/dashboard" },
          { label: "Contractors", to: "/admin/contractors" },
          { label: c.id },
        ]}
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <Section title="Performance" bodyClassName="space-y-5">
          <div className="flex justify-center">
            <ScoreMeter
              value={c.performanceScore}
              level={healthLevel(c.performanceScore)}
              label="Performance score"
            />
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <MetaItem label="Licence" value={<StatePill>{c.licenseStatus}</StatePill>} />
            <MetaItem label="Active orders" value={c.activeOrders} />
            <MetaItem label="Completed" value={c.completedOrders} />
            <MetaItem label="Avg. completion" value={`${c.averageCompletionDays} days`} />
            <MetaItem label="Verification rate" value={`${c.verificationRate}%`} />
            <MetaItem label="Repeat damage" value={`${c.repeatDamageRate}%`} />
          </dl>
        </Section>

        <Section title="Assigned work orders" className="xl:col-span-2" bodyClassName="p-0 sm:p-0">
          {orders.length === 0 ? (
            <div className="p-4 sm:p-5">
              <EmptyState
                title="No assigned work"
                description="This contractor currently has no work orders in the system."
              />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {orders.map((w) => (
                <li key={w.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5">
                  <div>
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
                  <StatePill>{w.status}</StatePill>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </>
  );
}
