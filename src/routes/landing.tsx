import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
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
import { Section } from "@/components/ui/section";
import { APP_NAME } from "@/config";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/landing")({
  head: () =>
    seo(
      "AI-Powered Infrastructure Lifecycle & Safety Management",
      "InfraSetu unifies citizen reporting, AI damage detection, risk scoring, contractor work orders and immutable audit trails for public infrastructure.",
    ),
  component: LandingPage,
});

const CAPABILITIES = [
  {
    icon: Cpu,
    title: "AI damage detection",
    body: "Computer vision analyses citizen and field evidence to classify potholes, cracks and structural defects with confidence scoring.",
  },
  {
    icon: TriangleAlert,
    title: "Automated risk engine",
    body: "Severity, traffic exposure, asset age and complaint volume combine into a transparent 0–100 risk score.",
  },
  {
    icon: Building2,
    title: "Asset lifecycle registry",
    body: "Roads, bridges, flyovers, tunnels and culverts tracked from construction through every inspection and repair.",
  },
  {
    icon: Satellite,
    title: "Satellite intelligence",
    body: "Multi-year observation timelines surface unauthorised development and environmental risk around assets.",
  },
  {
    icon: ClipboardCheck,
    title: "Verified repairs",
    body: "Before/after evidence is machine-compared before a work order can be marked complete.",
  },
  {
    icon: FileClock,
    title: "Immutable audit trail",
    body: "Every automated decision records its inputs, outputs and governing policy for public accountability.",
  },
];

const LIFECYCLE = [
  "Citizen reports damage with geotagged evidence",
  "AI engine detects and classifies the defect",
  "Risk engine scores severity and urgency",
  "Work order is generated automatically",
  "Contractor executes and uploads evidence",
  "AI verification closes the loop into the audit log",
];

const ROLES = [
  {
    icon: ShieldCheck,
    title: "Government command centre",
    body: "Full oversight of assets, risk, work orders, contractors and analytics.",
    to: "/admin/dashboard" as const,
    cta: "Enter command centre",
  },
  {
    icon: Users,
    title: "Citizen portal",
    body: "Report infrastructure damage and track how the system responds.",
    to: "/citizen" as const,
    cta: "Report an issue",
  },
  {
    icon: HardHat,
    title: "Contractor workspace",
    body: "Receive assigned work orders and submit repair evidence.",
    to: "/contractor" as const,
    cta: "Open workspace",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 bg-navy px-4 text-navy-foreground sm:px-6">
        <BrandMark />
        <nav aria-label="Primary" className="ml-auto flex items-center gap-2">
          <Button variant="ghost" className="text-navy-foreground hover:bg-navy-2" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/admin/dashboard">Launch platform</Link>
          </Button>
        </nav>
      </header>

      <section className="bg-navy px-4 py-16 text-navy-foreground sm:px-6 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-navy-foreground/70 uppercase">
            Public Works Department · Government Platform
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight lg:text-6xl lg:leading-[1.05]">
            Infrastructure that reports, diagnoses and repairs itself.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-navy-foreground/80 lg:text-lg">
            {APP_NAME} connects citizen evidence, AI damage detection, automated risk scoring and
            contractor execution into a single accountable lifecycle — with every decision recorded.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/admin/dashboard">
                Explore the command centre
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/25 bg-transparent text-navy-foreground hover:bg-white/10 hover:text-navy-foreground"
              asChild
            >
              <Link to="/citizen/report">Report infrastructure damage</Link>
            </Button>
          </div>
          <dl className="mt-12 grid gap-6 sm:grid-cols-4">
            {[
              ["12,450", "Assets monitored"],
              ["94%", "Detection confidence"],
              ["2.8 days", "Average repair time"],
              ["100%", "Decisions audited"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-2xl font-semibold tabular-nums lg:text-3xl">{value}</dt>
                <dd className="text-[13px] text-navy-foreground/70">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-14 px-4 py-14 sm:px-6">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            One platform, the whole lifecycle
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c) => {
              const Icon = c.icon;
              return (
                <article
                  key={c.title}
                  className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
                >
                  <span className="flex size-9 items-center justify-center rounded-md bg-accent text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-foreground">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{c.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <Section
          title="The accountability loop"
          description="Six automated steps from citizen report to verified repair."
        >
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LIFECYCLE.map((step, i) => (
              <li key={step} className="flex gap-3 rounded-lg border border-border p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Choose your workspace
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <article
                  key={r.title}
                  className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
                >
                  <span className="flex size-9 items-center justify-center rounded-md bg-navy text-navy-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-foreground">{r.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{r.body}</p>
                  <Button variant="outline" className="mt-4 w-fit" asChild>
                    <Link to={r.to}>
                      {r.cta}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {APP_NAME} · Public Works Department</p>
          <nav aria-label="Footer" className="flex gap-4">
            <Link to="/login" className="hover:text-primary hover:underline">
              Sign in
            </Link>
            <Link to="/admin/audit" className="hover:text-primary hover:underline">
              Audit trail
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
