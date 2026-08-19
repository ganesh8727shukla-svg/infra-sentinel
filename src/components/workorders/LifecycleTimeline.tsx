import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepState = "done" | "current" | "todo";

export interface LifecycleStep {
  label: string;
  detail?: string;
  state: StepState;
}

export function LifecycleTimeline({ steps }: { steps: LifecycleStep[] }) {
  return (
    <ol className="relative">
      {steps.map((step, i) => (
        <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-6 left-[11px] h-[calc(100%-1rem)] w-px",
                step.state === "done" ? "bg-primary/50" : "bg-border",
              )}
            />
          )}
          <span
            className={cn(
              "z-1 flex size-6 shrink-0 items-center justify-center rounded-full border",
              step.state === "done" && "border-primary bg-primary text-primary-foreground",
              step.state === "current" && "border-moderate bg-moderate/15 text-moderate",
              step.state === "todo" && "border-border bg-card text-muted-foreground",
            )}
          >
            {step.state === "done" ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : step.state === "current" ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Circle className="size-2.5" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0 pt-0.5">
            <p
              className={cn(
                "text-sm font-medium",
                step.state === "todo" ? "text-muted-foreground" : "text-foreground",
              )}
            >
              {step.label}
              <span className="sr-only">
                {" — "}
                {step.state === "done" ? "completed" : step.state === "current" ? "in progress" : "pending"}
              </span>
            </p>
            {step.detail && <p className="text-xs text-muted-foreground">{step.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

const ORDER = [
  "Issue Reported",
  "AI Analysed",
  "Risk Calculated",
  "Work Order Generated",
  "Contractor Assigned",
  "Repair In Progress",
  "AI Verification",
  "Completed",
];

export function workOrderSteps(status: string, verification: string): LifecycleStep[] {
  let reached = 5;
  if (status === "Pending") reached = 4;
  if (status === "Assigned") reached = 5;
  if (status === "In Progress") reached = 6;
  if (status === "Verification") reached = 7;
  if (status === "Completed" || verification === "Verified") reached = 8;
  return ORDER.map((label, idx) => ({
    label,
    state: idx + 1 < reached ? "done" : idx + 1 === reached ? "current" : "todo",
  }));
}
