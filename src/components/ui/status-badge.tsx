import { AlertOctagon, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { RiskLevel } from "@/types";
import { LEVEL_LABEL } from "@/utils/format";
import { cn } from "@/lib/utils";

const STYLES: Record<RiskLevel, { className: string; Icon: LucideIcon }> = {
  healthy: {
    className: "border-healthy/30 bg-healthy/10 text-healthy",
    Icon: CheckCircle2,
  },
  moderate: {
    className: "border-moderate/30 bg-moderate/10 text-moderate",
    Icon: Info,
  },
  high: { className: "border-high/30 bg-high/10 text-high", Icon: AlertTriangle },
  critical: {
    className: "border-critical/30 bg-critical/10 text-critical",
    Icon: AlertOctagon,
  },
};

export function StatusBadge({
  level,
  label,
  className,
  size = "sm",
}: {
  level: RiskLevel;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const { className: tone, Icon } = STYLES[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-[13px]",
        tone,
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {label ?? LEVEL_LABEL[level]}
    </span>
  );
}

export function StatePill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
