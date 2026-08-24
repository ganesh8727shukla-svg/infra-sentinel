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
import { useComplaints } from "@/hooks/useInfraData";
import { riskLevel, timeAgo } from "@/utils/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/complaints/")({
  head: () =>
    seo("Citizen complaints", "Every citizen report with AI analysis status, assigned risk and pipeline stage."),
  component: ComplaintsPage,
});

const STATUSES = [
  "Reported",
  "AI Analysed",
  "Risk Assigned",
  "Work Order Created",
  "Resolved",
  "Rejected",
];

function ComplaintsPage() {
  const complaints = useComplaints();
  const [status, setStatus] = useState("all");

  const rows = (complaints.data ?? []).filter((c) => status === "all" || c.status === status);

  return (
    <>
      <PageHeader
        title="Citizen complaints"
        subtitle="Reports submitted by citizens and their progress through the automated pipeline."
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Complaints" }]}
      />

      <Section bodyClassName="space-y-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-56" aria-label="Filter by status">
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

        {complaints.isError ? (
          <ErrorState onRetry={() => void complaints.refetch()} />
        ) : complaints.isLoading ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <EmptyState title="No complaints" description="No citizen reports match this filter." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Complaint</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>AI</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link
                        to="/admin/complaints/$complaintId"
                        params={{ complaintId: c.id }}
                        className="font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {c.id}
                      </Link>
                      <p className="text-xs text-muted-foreground">{c.submittedBy}</p>
                    </TableCell>
                    <TableCell>{c.assetId}</TableCell>
                    <TableCell>{c.issueType}</TableCell>
                    <TableCell>
                      <StatePill>{c.aiStatus}</StatePill>
                    </TableCell>
                    <TableCell>
                      {c.riskScore === null ? (
                        <span className="text-xs text-muted-foreground">Pending</span>
                      ) : (
                        <StatusBadge level={riskLevel(c.riskScore)} label={String(c.riskScore)} />
                      )}
                    </TableCell>
                    <TableCell>
                      <StatePill>{c.status}</StatePill>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{timeAgo(c.createdAt)}</TableCell>
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
