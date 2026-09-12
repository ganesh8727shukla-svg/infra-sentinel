import type { RiskLevel } from "@/types";
import { LEVEL_HEX, LEVEL_LABEL } from "@/utils/format";
import { cn } from "@/lib/utils";

export function ScoreMeter({
  value,
  level,
  label,
  size = 132,
}: {
  value: number;
  level: RiskLevel;
  label: string;
  size?: number;
}) {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.min(100, Math.max(0, value)) / 100) * circumference;
  return (
    <figure className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label={`${label} ${value} out of 100, ${LEVEL_LABEL[level]}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={9}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={LEVEL_HEX[level]}
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums text-foreground">{value}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <figcaption className="text-center">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs font-medium" style={{ color: LEVEL_HEX[level] }}>
          {LEVEL_LABEL[level]}
        </span>
      </figcaption>
    </figure>
  );
}

export function ScoreBar({
  value,
  level,
  className,
}: {
  value: number;
  level: RiskLevel;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: LEVEL_HEX[level] }}
        />
      </div>
      <span className="text-sm font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}
