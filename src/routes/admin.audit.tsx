import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileClock, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { MetaItem, Section } from "@/components/ui/section";
import { StatePill } from "@/components/ui/status-badge";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/ui/states";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuditLogs } from "@/hooks/useInfraData";
import { formatDateTime } from "@/utils/format";
import { seo } from "@/lib/seo";
import type { AuditLog } from "@/types";

export const Route = createFileRoute("/admin/audit")({
  head: () =>
    seo(
      "Audit trail",
      "Immutable record of every automated and human decision across the infrastructure lifecycle.",
    ),
  component: AuditPage,
});

const ACTORS = ["All actors", "AUTOMATED SYSTEM", "SYSTEM", "CITIZEN", "CONTRACTOR", "OFFICER"];

function AuditPage() {
  const logs = useAuditLogs();
  const [query, setQuery] = useState("");
  const [actor, setActor] = useState("All actors");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (logs.data ?? []).filter((l) => {
      const matchesActor = actor === "All actors" || l.actorType === actor;
      const matchesQuery =
        !q ||
        [l.id, l.assetId, l.eventType, l.description, l.actorId, l.systemDecision]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesActor && matchesQuery;
    });
  }, [logs.data, query, actor]);

  const selected: AuditLog | undefined =
    filtered.find((l) => l.id === selectedId) ?? filtered[0];

  return (
    <>
      <PageHeader
        title="Audit trail"
        subtitle="Every decision — automated or human — is recorded with its inputs, outputs and governing policy."
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Audit trail" }]}
      />

      {logs.isError ? (
        <ErrorState onRetry={() => void logs.refetch()} />
      ) : logs.isLoading ? (
        <TableSkeleton rows={8} cols={4} />
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          <Section
            title="Decision log"
            description={`${filtered.length} recorded events`}
            className="xl:col-span-2"
            bodyClassName="space-y-3"
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search events, assets…"
                    aria-label="Search audit events"
                    className="h-9 w-56 pl-8"
                  />
                </div>
                <Select value={actor} onValueChange={setActor}>
                  <SelectTrigger className="h-9 w-44" aria-label="Filter by actor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTORS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            }
          >
            {filtered.length === 0 ? (
              <EmptyState
                icon={<FileClock className="size-5" aria-hidden="true" />}
                title="No audit events"
                description="No decisions match the current search or actor filter."
              />
            ) : (
              <ol className="space-y-2">
                {filtered.map((log) => {
                  const active = selected?.id === log.id;
                  return (
                    <li key={log.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(log.id)}
                        aria-current={active ? "true" : undefined}
                        className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                          active
                            ? "border-primary bg-accent"
                            : "border-border bg-card hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {log.eventType}
                          </span>
                          <StatePill>{log.actorType}</StatePill>
                          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                            {formatDateTime(log.timestamp)}
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] text-muted-foreground">{log.description}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {log.assetId} · {log.actorId} · {log.systemDecision}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
          </Section>

          <div className="space-y-5">
            {selected ? (
              <>
                <Section title={`Event ${selected.id}`} bodyClassName="space-y-4">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <MetaItem label="Event type" value={selected.eventType} />
                    <MetaItem label="Timestamp" value={formatDateTime(selected.timestamp)} />
                    <MetaItem label="Actor" value={`${selected.actorType} · ${selected.actorId}`} />
                    <MetaItem label="System decision" value={selected.systemDecision} />
                    <MetaItem label="Policy" value={selected.metadata?.policy ?? "—"} />
                    <MetaItem label="Resulting action" value={selected.metadata?.action ?? "—"} />
                  </dl>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/assets/$assetId" params={{ assetId: selected.assetId }}>
                      View asset {selected.assetId}
                    </Link>
                  </Button>
                </Section>

                {(selected.metadata?.inputs?.length || selected.metadata?.outputs?.length) && (
                  <Section title="Decision inputs & outputs" bodyClassName="space-y-4">
                    {selected.metadata?.inputs && selected.metadata.inputs.length > 0 && (
                      <div>
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Inputs
                        </p>
                        <dl className="mt-2 space-y-1.5">
                          {selected.metadata.inputs.map((f) => (
                            <div key={f.label} className="flex justify-between gap-3 text-sm">
                              <dt className="text-muted-foreground">{f.label}</dt>
                              <dd className="font-medium text-foreground">{f.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                    {selected.metadata?.outputs && selected.metadata.outputs.length > 0 && (
                      <div>
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Outputs
                        </p>
                        <dl className="mt-2 space-y-1.5">
                          {selected.metadata.outputs.map((f) => (
                            <div key={f.label} className="flex justify-between gap-3 text-sm">
                              <dt className="text-muted-foreground">{f.label}</dt>
                              <dd className="font-medium text-foreground">{f.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                  </Section>
                )}
              </>
            ) : (
              <Section title="Event detail">
                <p className="text-sm text-muted-foreground">
                  Select an event to inspect its inputs, outputs and governing policy.
                </p>
              </Section>
            )}
          </div>
        </div>
      )}
    </>
  );
}
