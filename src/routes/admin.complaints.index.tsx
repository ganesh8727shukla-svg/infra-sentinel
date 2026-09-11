import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileWarning,
  Search,
  ShieldCheck,
} from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { StatePill, StatusBadge } from "@/components/ui/status-badge";
import {
  EmptyState,
  ErrorState,
  TableSkeleton,
} from "@/components/ui/states";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    seo(
      "Citizen complaints",
      "Citizen infrastructure reports with AI analysis, risk assessment and resolution status.",
    ),
  component: ComplaintsPage,
});

const STATUSES = [
  "Reported",
  "AI Analysed",
  "Risk Assigned",
  "Work Order Created",
  "Under Assessment",
  "Resolved",
  "Rejected",
] as const;

const AI_STATUSES = [
  "Pending",
  "Analysing",
  "Completed",
] as const;

function ComplaintsPage() {
  const complaints = useComplaints();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [aiStatus, setAiStatus] = useState("all");
  const [risk, setRisk] = useState("all");

  const complaintList = complaints.data ?? [];

  const stats = useMemo(() => {
    const total = complaintList.length;

    const open = complaintList.filter(
      (c) =>
        c.status !== "Resolved" &&
        c.status !== "Rejected",
    ).length;

    /*
     * The backend/frontend contract currently exposes:
     * Pending | Analysing | Completed
     *
     * Therefore "Completed" is the authoritative AI-complete state.
     */
    const analysed = complaintList.filter(
      (c) => c.aiStatus === "Completed",
    ).length;

    const highRisk = complaintList.filter(
      (c) =>
        typeof c.riskScore === "number" &&
        c.riskScore >= 50,
    ).length;

    const resolved = complaintList.filter(
      (c) => c.status === "Resolved",
    ).length;

    return {
      total,
      open,
      analysed,
      highRisk,
      resolved,
    };
  }, [complaintList]);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return complaintList
      .filter((c) => {
        if (status !== "all" && c.status !== status) {
          return false;
        }

        if (aiStatus !== "all" && c.aiStatus !== aiStatus) {
          return false;
        }

        if (risk !== "all") {
          if (typeof c.riskScore !== "number") {
            return risk === "pending";
          }

          const level = riskLevel(c.riskScore);

          if (level !== risk) {
            return false;
          }
        }

        if (!query) {
          return true;
        }

        return [
          c.id,
          c.assetId,
          c.issueType,
          c.submittedBy,
          c.status,
          c.aiStatus,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query),
          );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
  }, [
    complaintList,
    search,
    status,
    aiStatus,
    risk,
  ]);

  const hasActiveFilters =
    search.trim() !== "" ||
    status !== "all" ||
    aiStatus !== "all" ||
    risk !== "all";

  function clearFilters() {
    setSearch("");
    setStatus("all");
    setAiStatus("all");
    setRisk("all");
  }

  return (
    <>
      <PageHeader
        title="Citizen complaints"
        subtitle="Monitor citizen reports from submission through AI assessment, risk assignment and resolution."
        crumbs={[
          {
            label: "Admin",
            to: "/admin/dashboard",
          },
          {
            label: "Complaints",
          },
        ]}
      />

      {/* Overview */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          icon={FileWarning}
          label="Total reports"
          value={stats.total}
          description="All citizen submissions"
        />

        <SummaryCard
          icon={Clock3}
          label="Open"
          value={stats.open}
          description="Awaiting resolution"
        />

        <SummaryCard
          icon={ShieldCheck}
          label="AI analysed"
          value={stats.analysed}
          description="Reports assessed by AI"
        />

        <SummaryCard
          icon={AlertCircle}
          label="High risk"
          value={stats.highRisk}
          description="Risk score 50 or above"
          emphasis={stats.highRisk > 0}
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Resolved"
          value={stats.resolved}
          description="Closed successfully"
        />
      </div>

      <Section
        className="mt-5"
        bodyClassName="space-y-4"
      >
        {/* Filters */}
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1 xl:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search complaint, asset, issue or citizen..."
              aria-label="Search complaints"
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger
                className="w-[180px]"
                aria-label="Filter by complaint status"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All statuses
                </SelectItem>

                {STATUSES.map((value) => (
                  <SelectItem
                    key={value}
                    value={value}
                  >
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={aiStatus}
              onValueChange={setAiStatus}
            >
              <SelectTrigger
                className="w-[170px]"
                aria-label="Filter by AI status"
              >
                <SelectValue placeholder="AI status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All AI states
                </SelectItem>

                {AI_STATUSES.map((value) => (
                  <SelectItem
                    key={value}
                    value={value}
                  >
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={risk}
              onValueChange={setRisk}
            >
              <SelectTrigger
                className="w-[160px]"
                aria-label="Filter by risk"
              >
                <SelectValue placeholder="Risk" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All risk levels
                </SelectItem>

                <SelectItem value="critical">
                  Critical
                </SelectItem>

                <SelectItem value="high">
                  High
                </SelectItem>

                <SelectItem value="moderate">
                  Moderate
                </SelectItem>

                <SelectItem value="healthy">
                  Healthy
                </SelectItem>

                <SelectItem value="pending">
                  Risk pending
                </SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Result summary */}
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              {rows.length}{" "}
              {rows.length === 1
                ? "complaint"
                : "complaints"}
            </p>

            <p className="text-xs text-muted-foreground">
              {hasActiveFilters
                ? "Filtered from the live complaint registry."
                : "Latest citizen reports appear first."}
            </p>
          </div>

          {complaintList.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {complaintList.length} total records
            </span>
          )}
        </div>

        {/* Data states */}
        {complaints.isError ? (
          <ErrorState
            onRetry={() =>
              void complaints.refetch()
            }
          />
        ) : complaints.isLoading ? (
          <TableSkeleton rows={7} cols={7} />
        ) : rows.length === 0 ? (
          <EmptyState
            title={
              hasActiveFilters
                ? "No matching complaints"
                : "No complaints yet"
            }
            description={
              hasActiveFilters
                ? "Try clearing one or more filters to see more citizen reports."
                : "Citizen submissions will appear here as they enter the system."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Complaint</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>AI analysis</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Pipeline</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((complaint) => (
                  <TableRow
                    key={complaint.id}
                    className="group"
                  >
                    {/* Complaint */}
                    <TableCell>
                      <Link
                        to="/admin/complaints/$complaintId"
                        params={{
                          complaintId: complaint.id,
                        }}
                        className="font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {complaint.id}
                      </Link>

                      <p className="mt-0.5 max-w-[150px] truncate text-xs text-muted-foreground">
                        {complaint.submittedBy || "Citizen"}
                      </p>
                    </TableCell>

                    {/* Asset */}
                    <TableCell>
                      <Link
                        to="/admin/assets/$assetId"
                        params={{
                          assetId: complaint.assetId,
                        }}
                        className="font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {complaint.assetId}
                      </Link>
                    </TableCell>

                    {/* Issue */}
                    <TableCell>
                      <span className="font-medium text-foreground">
                        {complaint.issueType}
                      </span>
                    </TableCell>

                    {/* AI */}
                    <TableCell>
                      <StatePill>
                        {complaint.aiStatus || "Pending"}
                      </StatePill>
                    </TableCell>

                    {/* Risk */}
                    <TableCell>
                      {typeof complaint.riskScore !==
                      "number" ? (
                        <span className="text-xs text-muted-foreground">
                          Awaiting score
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <StatusBadge
                            level={riskLevel(
                              complaint.riskScore,
                            )}
                            label={complaint.riskScore.toFixed(
                              1,
                            )}
                          />
                        </div>
                      )}
                    </TableCell>

                    {/* Pipeline */}
                    <TableCell>
                      <StatePill>
                        {complaint.status}
                      </StatePill>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {timeAgo(complaint.createdAt)}
                    </TableCell>
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

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
  emphasis = false,
}: {
  icon: typeof FileWarning;
  label: string;
  value: number;
  description: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border bg-card p-4 shadow-sm",
        emphasis
          ? "border-red-200 dark:border-red-900/50"
          : "border-border",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">
            {label}
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            {value}
          </p>
        </div>

        <div className="rounded-lg bg-muted p-2">
          <Icon
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">
        {description}
      </p>
    </div>
  );
}