import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin/satellite")({
  head: () =>
    seo(
      "Satellite Intelligence",
      "Satellite-based infrastructure monitoring, change detection and environmental risk intelligence.",
    ),
  component: SatelliteIntelligencePage,
});

function SatelliteIntelligencePage() {
  return (
    <>
      <PageHeader
        title="Satellite Intelligence"
        subtitle="Satellite-based monitoring and change detection for infrastructure assets."
        crumbs={[
          { label: "Admin", to: "/admin/dashboard" },
          { label: "Satellite Intelligence" },
        ]}
      />

      <div className="space-y-6">
        {/* Development Status */}
        <Section
          title="Satellite Intelligence Module"
          description="Earth observation signals layered on top of the InfraSetu asset registry."
        >
          <div className="rounded-xl border border-border bg-background p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                  Module under development
                </div>

                <h2 className="text-2xl font-semibold tracking-tight">
                  Satellite monitoring is being developed
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  InfraSetu will integrate satellite and Earth-observation
                  data to continuously monitor infrastructure assets,
                  identify changes around critical locations and provide
                  additional evidence for infrastructure risk assessment.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 px-5 py-4 lg:min-w-[220px]">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Current status
                </p>
                <p className="mt-1 text-lg font-semibold">
                  Data integration in progress
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* What we are building */}
        <Section
          title="What we are building"
          description="The planned satellite intelligence workflow for InfraSetu."
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              number="01"
              title="Satellite Data Acquisition"
              description="Collect periodic Earth-observation imagery and relevant satellite-derived datasets for registered infrastructure locations."
            />

            <FeatureCard
              number="02"
              title="Asset-Level Monitoring"
              description="Link satellite observations with the existing InfraSetu asset registry using asset location and geographic coordinates."
            />

            <FeatureCard
              number="03"
              title="Change Detection"
              description="Compare observations over time to identify significant changes around roads, bridges, waterways and other infrastructure."
            />

            <FeatureCard
              number="04"
              title="Environmental Risk"
              description="Analyse surrounding environmental conditions such as water accumulation, vegetation changes, land-use changes and terrain-related signals."
            />

            <FeatureCard
              number="05"
              title="Infrastructure Evidence"
              description="Use satellite observations as an additional evidence layer alongside citizen complaints, AI image detection and inspection data."
            />

            <FeatureCard
              number="06"
              title="Risk Intelligence"
              description="Feed relevant satellite indicators into the InfraSetu risk engine to improve asset-level risk assessment and prioritisation."
            />
          </div>
        </Section>

        {/* Planned workflow */}
        <Section
          title="Planned satellite intelligence workflow"
          description="How satellite information will become actionable infrastructure intelligence."
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <WorkflowCard
              step="1"
              title="Acquire"
              description="Obtain satellite observations for registered asset locations."
            />

            <WorkflowCard
              step="2"
              title="Process"
              description="Prepare imagery and derive relevant geographic indicators."
            />

            <WorkflowCard
              step="3"
              title="Compare"
              description="Compare current observations with historical observations."
            />

            <WorkflowCard
              step="4"
              title="Assess"
              description="Generate change and environmental risk indicators."
            />

            <WorkflowCard
              step="5"
              title="Act"
              description="Use the intelligence to support inspection and maintenance decisions."
            />
          </div>
        </Section>

        {/* Data that will be covered */}
        <Section
          title="Data that will be covered"
          description="Planned data layers and indicators."
        >
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-1 border-b border-border bg-muted/40 px-5 py-3 text-sm font-semibold md:grid-cols-3">
              <div>Data layer</div>
              <div className="hidden md:block">Purpose</div>
              <div className="hidden md:block">Planned output</div>
            </div>

            <DataRow
              title="Satellite imagery"
              purpose="Observe asset surroundings"
              output="Latest observation"
            />

            <DataRow
              title="Historical imagery"
              purpose="Compare infrastructure surroundings over time"
              output="Change history"
            />

            <DataRow
              title="Change detection"
              purpose="Identify significant geographic changes"
              output="Change level"
            />

            <DataRow
              title="Environmental indicators"
              purpose="Identify environmental stress signals"
              output="Environmental risk"
            />

            <DataRow
              title="Geographic location"
              purpose="Connect satellite observations to assets"
              output="Asset-linked observation"
            />

            <DataRow
              title="Observation date"
              purpose="Track when satellite evidence was captured"
              output="Last observation"
            />
          </div>
        </Section>

        {/* Integration with InfraSetu */}
        <Section
          title="Integration with InfraSetu"
          description="Satellite intelligence will complement the existing infrastructure monitoring pipeline."
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <IntegrationCard
              title="Citizen Complaints"
              description="Ground-level reports submitted by citizens."
            />

            <IntegrationCard
              title="AI Detection"
              description="Computer-vision analysis of uploaded infrastructure images."
            />

            <IntegrationCard
              title="Risk Engine"
              description="Combines multiple infrastructure risk indicators."
            />

            <IntegrationCard
              title="Satellite Intelligence"
              description="Independent geographic and environmental evidence."
            />
          </div>

          <div className="mt-5 rounded-xl border border-border bg-muted/20 p-5">
            <p className="text-sm font-semibold">
              Planned decision pipeline
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <PipelineItem label="Asset" />
              <Arrow />
              <PipelineItem label="Satellite Observation" />
              <Arrow />
              <PipelineItem label="Change Detection" />
              <Arrow />
              <PipelineItem label="Risk Assessment" />
              <Arrow />
              <PipelineItem label="Inspection / Action" />
            </div>
          </div>
        </Section>

        {/* Current implementation */}
        <Section
          title="Current implementation status"
          description="Development roadmap for the satellite intelligence module."
        >
          <div className="space-y-3">
            <StatusRow
              title="Satellite data model"
              status="Planned"
            />

            <StatusRow
              title="Asset-to-satellite geographic mapping"
              status="Planned"
            />

            <StatusRow
              title="Historical observation storage"
              status="Planned"
            />

            <StatusRow
              title="Change detection pipeline"
              status="In development"
            />

            <StatusRow
              title="Environmental risk indicators"
              status="Planned"
            />

            <StatusRow
              title="Satellite intelligence dashboard"
              status="Current demo"
            />

            <StatusRow
              title="Integration with InfraSetu risk engine"
              status="Planned"
            />
          </div>
        </Section>

        {/* Demo note */}
        <div className="rounded-xl border border-border bg-muted/20 p-6">
          <p className="text-sm font-semibold">
            Demo note
          </p>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
            This module is currently presented as a development preview.
            Satellite data integration is being developed and will be
            connected to the InfraSetu asset registry once the observation
            pipeline is completed. The current page intentionally does not
            display placeholder satellite observations or fabricated satellite
            results.
          </p>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function FeatureCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-xs font-semibold">
          {number}
        </div>

        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function WorkflowCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Step {step}
      </p>

      <h3 className="mt-2 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function DataRow({
  title,
  purpose,
  output,
}: {
  title: string;
  purpose: string;
  output: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 border-b border-border px-5 py-4 last:border-b-0 md:grid-cols-3">
      <div className="text-sm font-medium">{title}</div>

      <div className="text-sm text-muted-foreground">
        {purpose}
      </div>

      <div className="text-sm text-muted-foreground">
        {output}
      </div>
    </div>
  );
}

function IntegrationCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <h3 className="font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function StatusRow({
  title,
  status,
}: {
  title: string;
  status: "Planned" | "In development" | "Current demo";
}) {
  const statusClasses =
    status === "Current demo"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : status === "In development"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-border bg-muted/40 text-muted-foreground";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium">{title}</span>

      <span
        className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium ${statusClasses}`}
      >
        {status}
      </span>
    </div>
  );
}

function PipelineItem({ label }: { label: string }) {
  return (
    <span className="rounded-lg border border-border bg-background px-3 py-2 font-medium">
      {label}
    </span>
  );
}

function Arrow() {
  return (
    <span className="text-muted-foreground">→</span>
  );
}