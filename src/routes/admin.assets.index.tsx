import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Input } from "@/components/ui/input";
import { StatePill, StatusBadge } from "@/components/ui/status-badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssets } from "@/hooks/useInfraData";
import { formatDate, healthLevel, riskLevel } from "@/utils/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/assets/")({
  head: () =>
    seo(
      "Infrastructure registry",
      "Searchable registry of roads, bridges, flyovers, tunnels and culverts with live health and risk scores.",
    ),
  component: AssetsPage,
});

function AssetsPage() {
  const assets = useAssets();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [district, setDistrict] = useState("all");

  const districts = useMemo(
    () => Array.from(new Set((assets.data ?? []).map((a) => a.district))).sort(),
    [assets.data],
  );

  const rows = (assets.data ?? []).filter((a) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.assetCode.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q);
    return (
      matchesQuery && (type === "all" || a.type === type) && (district === "all" || a.district === district)
    );
  });

  return (
    <>
      <PageHeader
        title="Infrastructure registry"
        subtitle="Every monitored asset with its current health, risk and lifecycle status."
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Infrastructure" }]}
      />

      <Section bodyClassName="space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-56 flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, code or location"
              aria-label="Search assets"
              className="pl-8"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-40" aria-label="Filter by type">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {["Road", "Bridge", "Flyover", "Tunnel", "Culvert"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger className="w-44" aria-label="Filter by district">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All districts</SelectItem>
              {districts.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {assets.isError ? (
          <ErrorState onRetry={() => void assets.refetch()} />
        ) : assets.isLoading ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No assets match your filters"
            description="Adjust the search term, type or district to widen the results."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last inspection</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <Link
                        to="/admin/assets/$assetId"
                        params={{ assetId: a.id }}
                        className="font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {a.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{a.assetCode}</p>
                    </TableCell>
                    <TableCell>{a.type}</TableCell>
                    <TableCell>{a.district}</TableCell>
                    <TableCell>
                      <ScoreBar value={a.healthScore} level={healthLevel(a.healthScore)} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge level={riskLevel(a.riskScore)} label={String(a.riskScore)} />
                    </TableCell>
                    <TableCell>
                      <StatePill>{a.status}</StatePill>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(a.lastInspection)}
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
