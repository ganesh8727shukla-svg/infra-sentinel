import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { StatePill, StatusBadge } from "@/components/ui/status-badge";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/states";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkOrders } from "@/hooks/useInfraData";
import { formatDate, riskLevel } from "@/utils/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/work-orders/")({
  head: () =>
    seo("Work orders", "Automated and manual maintenance work orders with priority, contractor and verification state."),
  component: WorkOrdersPage,
});

const STATUSES = [
  "Pending",
  "Assigned",
  "In Progress",
  "Verification",
  "Completed",
  "Exception Review",
];

function WorkOrdersPage() {
  const workOrders = useWorkOrders();
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");

  const rows = (workOrders.data ?? []).filter(
    (w) => (status === "all" || w.status === status) && (priority === "all" || w.priority === priority),
  );

  return (
    <>
      <PageHeader
        title="Work orders"
        subtitle="Execution pipeline from assignment through AI-verified completion."
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Work Orders" }]}
      />

      <Section bodyClassName="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-52" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-44" aria-label="Filter by priority">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {["Critical", "High", "Normal"].map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {workOrders.isError ? (
          <ErrorState onRetry={() => void workOrders.refetch()} />
        ) : workOrders.isLoading ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <EmptyState title="No work orders" description="No work orders match the selected filters." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Contractor</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Deadline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell>
                      <Link
                        to="/admin/work-orders/$workOrderId"
                        params={{ workOrderId: w.id }}
                        className="font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {w.id}
                      </Link>
                      <p className="text-xs text-muted-foreground">{w.issue}</p>
                    </TableCell>
                    <TableCell>{w.assetId}</TableCell>
                    <TableCell>
                      <Link
                        to="/admin/contractors/$contractorId"
                        params={{ contractorId: w.contractorId }}
                        className="hover:text-primary hover:underline"
                      >
                        {w.contractorId}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatePill>{w.priority}</StatePill>
                    </TableCell>
                    <TableCell>
                      <StatusBadge level={riskLevel(w.riskScore)} label={String(w.riskScore)} />
                    </TableCell>
                    <TableCell>
                      <StatePill>{w.status}</StatePill>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{w.verificationStatus}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(w.deadline)}</TableCell>
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
