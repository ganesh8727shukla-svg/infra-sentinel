import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function KPICard({
  label,
  value,
  support,
  trend,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  support?: string;
  trend?: { direction: "up" | "down"; value: string };
  icon?: LucideIcon;
  tone?: "neutral" | "healthy" | "moderate" | "high" | "critical";
}) {
  const toneBar: Record<string, string> = {
    neutral: "bg-primary",
    healthy: "bg-healthy",
    moderate: "bg-moderate",
    high: "bg-high",
    critical: "bg-critical",
  };
  const Trend = trend?.direction === "down" ? TrendingDown : TrendingUp;
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <span className={cn("absolute inset-y-0 left-0 w-1", toneBar[tone])} aria-hidden="true" />
      <div className="flex items-start justify-between gap-2 pl-2">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        {Icon && <Icon className="size-4 text-muted-foreground" aria-hidden="true" />}
      </div>
      <p className="mt-2 pl-2 text-[28px] leading-none font-semibold tracking-tight text-foreground tabular-nums">
        {typeof value === "number" ? value.toLocaleString("en-IN") : value}
      </p>
      <div className="mt-2 flex items-center gap-2 pl-2">
        {support && <span className="text-xs text-muted-foreground">{support}</span>}
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              trend.direction === "up" ? "text-healthy" : "text-high",
            )}
          >
            <Trend className="size-3.5" aria-hidden="true" />
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
