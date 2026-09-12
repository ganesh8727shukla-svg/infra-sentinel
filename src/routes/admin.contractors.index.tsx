import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { StatePill } from "@/components/ui/status-badge";
import { ScoreBar } from "@/components/ui/score-meter";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/states";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContractors } from "@/hooks/useInfraData";
import { healthLevel } from "@/utils/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/contractors/")({
  head: () =>
    seo("Contractors", "Empanelled contractor performance, verification rates and repeat-damage tracking."),
  component: ContractorsPage,
});

function ContractorsPage() {
  const contractors = useContractors();
  const rows = contractors.data ?? [];

  return (
    <>
      <PageHeader
        title="Contractors"
        subtitle="Performance and accountability across empanelled maintenance agencies."
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Contractors" }]}
      />

      <Section bodyClassName="space-y-4">
        {contractors.isError ? (
          <ErrorState onRetry={() => void contractors.refetch()} />
        ) : contractors.isLoading ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <EmptyState title="No contractors" description="No empanelled contractors are registered." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contractor</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Licence</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Avg. days</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Repeat damage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link
                        to="/admin/contractors/$contractorId"
                        params={{ contractorId: c.id }}
                        className="font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {c.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{c.id}</p>
                    </TableCell>
                    <TableCell>{c.district}</TableCell>
                    <TableCell>
                      <StatePill>{c.licenseStatus}</StatePill>
                    </TableCell>
                    <TableCell className="tabular-nums">{c.activeOrders}</TableCell>
                    <TableCell className="tabular-nums">{c.completedOrders}</TableCell>
                    <TableCell className="tabular-nums">{c.averageCompletionDays}</TableCell>
                    <TableCell>
                      <ScoreBar value={c.performanceScore} level={healthLevel(c.performanceScore)} />
                    </TableCell>
                    <TableCell className="tabular-nums">{c.repeatDamageRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Section>
    </>
  );
}
