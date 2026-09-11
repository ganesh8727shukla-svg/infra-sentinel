import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  FileClock,
  HardHat,
  Satellite,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/layout/Header";
import { APP_NAME } from "@/config";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/landing")({
  head: () =>
    seo(
      "AI-Powered Infrastructure Lifecycle & Safety Management",
      "InfraSetu connects citizen reporting, AI damage detection, explainable risk scoring, work-order management and AI-assisted repair verification.",
    ),
  component: LandingPage,
});

const LIFECYCLE = [
  {
    number: "01",
    title: "Report",
    body: "Citizens submit infrastructure issues with location and visual evidence.",
    icon: Users,
  },
  {
    number: "02",
    title: "Detect",
    body: "Computer vision identifies road defects and classifies their severity.",
    icon: Cpu,
  },
  {
    number: "03",
    title: "Prioritise",
    body: "Multiple evidence factors are combined into a transparent 0–100 risk score.",
    icon: TriangleAlert,
  },
  {
    number: "04",
    title: "Assign",
    body: "High-risk issues move into government work-order and contractor workflows.",
    icon: ClipboardCheck,
  },
  {
    number: "05",
    title: "Repair",
    body: "Contractors execute the assigned work and upload completion evidence.",
    icon: HardHat,
  },
  {
    number: "06",
    title: "Verify",
    body: "Before/after evidence is analysed before the repair is considered complete.",
    icon: CheckCircle2,
  },
];

const CAPABILITIES = [
  {
    icon: Cpu,
    title: "AI damage detection",
    body: "Computer vision analyses infrastructure evidence and identifies longitudinal cracks, transverse cracks, alligator cracks and potholes.",
    tag: "Computer Vision",
  },
  {
    icon: TriangleAlert,
    title: "Explainable risk engine",
    body: "AI evidence, defect severity, complaint volume, detection density and asset age contribute to a transparent 0–100 risk score.",
    tag: "0–100 Risk Score",
  },
  {
    icon: ClipboardCheck,
    title: "Automated work orders",
    body: "High-risk issues can move from assessment into actionable work orders with priority, required action and contractor assignment.",
    tag: "Government Workflow",
  },
  {
    icon: CheckCircle2,
    title: "AI-assisted repair verification",
    body: "Before and after evidence is compared to determine whether detected defects were reduced after repair.",
    tag: "Evidence Based",
  },
  {
    icon: Building2,
    title: "Asset lifecycle registry",
    body: "Roads, bridges, flyovers, tunnels and culverts can be tracked through their inspection, risk and repair lifecycle.",
    tag: "Asset Management",
  },
  {
    icon: FileClock,
    title: "Accountable audit trail",
    body: "System decisions and important workflow actions are recorded so the infrastructure lifecycle remains traceable.",
    tag: "Traceability",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-navy px-4 text-navy-foreground sm:px-6">
        <Link to="/" className="shrink-0">
          <BrandMark />
        </Link>

        <nav
          aria-label="Primary"
          className="ml-auto flex items-center gap-1.5"
        >
          <Button
            variant="ghost"
            className="text-navy-foreground hover:bg-navy-2"
            asChild
          >
            <Link to="/login">Sign in</Link>
          </Button>

          <Button asChild>
            <Link to="/register">Register</Link>
          </Button>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-navy px-4 py-16 text-navy-foreground sm:px-6 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-foreground/65">
              Public Works Department · Government Platform
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight lg:text-6xl lg:leading-[1.05]">
              From public report to verified repair — one accountable
              infrastructure lifecycle.
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-navy-foreground/80 lg:text-lg">
              {APP_NAME} connects citizen evidence, AI damage detection,
              explainable risk scoring, government work orders, contractor
              execution and repair verification in one platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/citizen/report">
                  Report infrastructure damage
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent text-navy-foreground hover:bg-white/10 hover:text-navy-foreground"
                asChild
              >
                <Link to="/login">Explore the platform</Link>
              </Button>
            </div>
          </div>

          {/* Capability strip */}
          <div className="mt-14 grid overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
            <HeroMetric
              value="4"
              label="AI defect classes"
              detail="Road damage detection"
            />

            <HeroMetric
              value="0–100"
              label="Explainable risk"
              detail="Evidence-based prioritisation"
            />

            <HeroMetric
              value="6"
              label="Lifecycle stages"
              detail="Report to verification"
            />

            <HeroMetric
              value="AI"
              label="Repair verification"
              detail="Before / after evidence"
            />
          </div>
        </div>
      </section>

      {/* Lifecycle */}
      <main className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-6 lg:py-16">
        <section>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              How InfraSetu works
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              One connected accountability loop
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Every stage produces evidence that moves the issue toward an
              actionable and verifiable outcome.
            </p>
          </div>

          <div className="relative mt-8">
            <div className="absolute left-[8%] right-[8%] top-9 hidden border-t border-dashed border-border lg:block" />

            <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {LIFECYCLE.map((step) => {
                const Icon = step.icon;

                return (
                  <li
                    key={step.number}
                    className="relative rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {step.number}
                      </span>

                      <Icon
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-foreground">
                      {step.title}
                    </h3>

                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                      {step.body}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Core capabilities */}
        <section>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Core capabilities
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Built around the infrastructure lifecycle
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Detection is only the beginning. InfraSetu connects AI insights
              to decisions, execution and verification.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((capability) => {
              const Icon = capability.icon;

              return (
                <article
                  key={capability.title}
                  className="group rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>

                    <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                      {capability.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {capability.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {capability.body}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Differentiator */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                What makes InfraSetu different
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Evidence does not stop at detection.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                The system creates a continuous chain from public evidence to
                government prioritisation, contractor action and machine
                assisted verification.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-5">
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                <FlowPill label="Citizen evidence" />
                <ArrowRight className="size-4 text-muted-foreground" />

                <FlowPill label="AI detection" />
                <ArrowRight className="size-4 text-muted-foreground" />

                <FlowPill label="Risk score" />
                <ArrowRight className="size-4 text-muted-foreground" />

                <FlowPill label="Work order" />
                <ArrowRight className="size-4 text-muted-foreground" />

                <FlowPill label="Repair evidence" />
                <ArrowRight className="size-4 text-muted-foreground" />

                <FlowPill label="AI verification" />
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4 text-primary" />

                  <span>
                    Traceable decisions create an accountable infrastructure
                    lifecycle.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional intelligence */}
        <section>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-border bg-card p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                <Building2 className="size-5" aria-hidden="true" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-foreground">
                Asset lifecycle registry
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Maintain a single view of infrastructure assets, their
                condition, complaints, risk and maintenance history.
              </p>
            </article>

            <article className="rounded-xl border border-border bg-card p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                <Satellite className="size-5" aria-hidden="true" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-foreground">
                Satellite intelligence
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Use satellite observation timelines as an additional
                intelligence layer around infrastructure and surrounding
                development.
              </p>
            </article>
          </div>
        </section>

        {/* Workspaces */}
        <section>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Platform access
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              One system, different responsibilities
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Each role sees the workflow relevant to its responsibility.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <WorkspaceCard
              icon={ShieldCheck}
              title="Government"
              body="Monitor assets, assess risk, manage work orders and review the audit trail."
            />

            {/* Citizen now goes to login */}
            <WorkspaceCard
              icon={Users}
              title="Citizen"
              body="Report infrastructure damage and follow the status of submitted issues."
              href="/login"
            />

            <WorkspaceCard
              icon={HardHat}
              title="Contractor"
              body="Receive assigned work orders and submit repair completion evidence."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {APP_NAME} · Public Works Department
          </p>

          <nav
            aria-label="Footer"
            className="flex items-center gap-4"
          >
            <Link
              to="/login"
              className="hover:text-primary hover:underline"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="hover:text-primary hover:underline"
            >
              Register
            </Link>

            <Link
              to="/admin/audit"
              className="hover:text-primary hover:underline"
            >
              Audit trail
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function HeroMetric({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail: string;
}) {
  return (
    <div className="border-b border-white/10 px-5 py-5 last:border-b-0 sm:border-r sm:border-b-0 lg:px-6">
      <p className="text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>

      <p className="mt-1 text-sm font-medium">
        {label}
      </p>

      <p className="mt-0.5 text-[11px] text-navy-foreground/55">
        {detail}
      </p>
    </div>
  );
}

function FlowPill({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground">
      {label}
    </span>
  );
}

function WorkspaceCard({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: typeof ShieldCheck;
  title: string;
  body: string;
  href?: "/citizen" | "/login";
}) {
  const content = (
    <>
      <div className="flex size-10 items-center justify-center rounded-lg bg-navy text-navy-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-foreground">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {body}
      </p>

      {href && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          Sign in as citizen
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-md"
      >
        {content}
      </Link>
    );
  }

  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      {content}
    </article>
  );
}