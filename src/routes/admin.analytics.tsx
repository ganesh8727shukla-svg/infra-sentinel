import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { CardSkeleton, ErrorState } from "@/components/ui/states";
import { useHealthAnalytics, useRiskAnalytics, useWorkOrderAnalytics } from "@/hooks/useInfraData";
import { LEVEL_HEX } from "@/utils/format";
import type { RiskLevel } from "@/types";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/analytics")({
  head: () =>
    seo(
      "Analytics",
      "Network health trends, district risk, work-order throughput, verification rates and expenditure.",
    ),
  component: AnalyticsPage,
});

const AXIS = { stroke: "var(--color-muted-foreground)", fontSize: 12 };

function AnalyticsPage() {
  const health = useHealthAnalytics();
  const risk = useRiskAnalytics();
  const work = useWorkOrderAnalytics();

  if (health.isError || risk.isError || work.isError)
    return (
      <>
        <PageHeader title="Analytics" crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Analytics" }]} />
        <ErrorState onRetry={() => void health.refetch()} />
      </>
    );

  const loading = health.isLoading || risk.isLoading || work.isLoading;

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Programme-level performance across health, risk, execution and spend."
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Analytics" }]}
      />

      {loading || !health.data || !risk.data || !work.data ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} className="h-72" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <Section title="Asset health distribution" description="Assets grouped by condition band.">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={health.data.distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {health.data.distribution.map((d) => (
                    <Cell key={d.key} fill={LEVEL_HEX[d.key as RiskLevel]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Average network health" description="Rolling monthly health index.">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={health.data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" {...AXIS} />
                <YAxis domain={[50, 80]} {...AXIS} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="health"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Risk by district" description="Mean risk score per district.">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={risk.data.byDistrict}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="district" {...AXIS} />
                <YAxis {...AXIS} />
                <Tooltip />
                <Bar dataKey="risk" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Work order throughput" description="Reported, created, completed and verified.">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={work.data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" {...AXIS} />
                <YAxis {...AXIS} />
                <Tooltip />
                <Legend />
                <Bar dataKey="reported" fill="#8FB3D9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="created" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill={LEVEL_HEX.healthy} radius={[4, 4, 0, 0]} />
                <Bar dataKey="verified" fill={LEVEL_HEX.moderate} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Verification rate" description="Share of repairs passing AI verification.">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={work.data.verificationRate}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" {...AXIS} />
                <YAxis domain={[70, 100]} {...AXIS} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke={LEVEL_HEX.healthy} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Repair time & expenditure" description="Average days to repair and monthly spend (₹ crore).">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={work.data.repairTime.map((r, i) => ({
                ...r,
                crore: work.data.expenditure[i]?.crore ?? 0,
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" {...AXIS} />
                <YAxis {...AXIS} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="days" stroke={LEVEL_HEX.high} strokeWidth={2} />
                <Line type="monotone" dataKey="crore" stroke="var(--color-primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Section>
        </div>
      )}
    </>
  );
}
