import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  CircleHelp,
  FileClock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/help")({
  component: HelpPage,
});

function HelpPage() {
  return (
    <>
      <PageHeader
        title="Help & Support"
        subtitle="Guidance and support for government administrators using InfraSetu."
        crumbs={[
          { label: "Admin", to: "/admin/dashboard" },
          { label: "Help" },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Section
          title="Getting started"
          description="Quick guidance for using the administration portal."
        >
          <div className="grid gap-3">
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 size-5 text-primary" />

                <div>
                  <h3 className="text-sm font-semibold">
                    Dashboard
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Monitor infrastructure health, risk, complaints,
                    work orders and programme performance.
                  </p>

                  <Link
                    to="/admin/dashboard"
                    className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    Open Dashboard →
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 text-primary" />

                <div>
                  <h3 className="text-sm font-semibold">
                    Risk & Alerts
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Review infrastructure risk levels and system-generated
                    alerts requiring administrative attention.
                  </p>

                  <Link
                    to="/admin/alerts"
                    className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    Open Risk & Alerts →
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start gap-3">
                <FileClock className="mt-0.5 size-5 text-primary" />

                <div>
                  <h3 className="text-sm font-semibold">
                    Audit Trail
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Review system decisions, user actions and automated
                    infrastructure events.
                  </p>

                  <Link
                    to="/admin/audit"
                    className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    Open Audit Trail →
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        <Section
          title="Support"
          description="Contact the appropriate support channel when assistance is required."
        >
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-5 text-primary" />

              <div>
                <h3 className="text-sm font-semibold">
                  Government Platform Support
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  For access, data or platform issues, contact your
                  designated InfraSetu system administrator.
                </p>

                <div className="mt-4 rounded-md border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">
                    Support channel
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    Public Works Department · InfraSetu Administration
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        <Section
          title="Frequently used areas"
          description="Common administrative functions."
        >
          <Card className="p-5">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <CircleHelp className="size-4 text-muted-foreground" />
                Infrastructure asset management
              </li>

              <li className="flex items-center gap-2">
                <CircleHelp className="size-4 text-muted-foreground" />
                Complaint review and resolution
              </li>

              <li className="flex items-center gap-2">
                <CircleHelp className="size-4 text-muted-foreground" />
                Work-order monitoring
              </li>

              <li className="flex items-center gap-2">
                <CircleHelp className="size-4 text-muted-foreground" />
                Contractor performance
              </li>

              <li className="flex items-center gap-2">
                <CircleHelp className="size-4 text-muted-foreground" />
                Analytics and audit records
              </li>
            </ul>
          </Card>
        </Section>

        <Section
          title="Need more assistance?"
          description="Access account and application configuration."
        >
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <CircleHelp className="mt-0.5 size-5 text-primary" />

              <div>
                <h3 className="text-sm font-semibold">
                  Administrator Settings
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your profile, language, appearance,
                  accessibility and security preferences.
                </p>

                <Link
                  to="/admin/settings"
                  className="mt-3 inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Open Settings
                </Link>
              </div>
            </div>
          </Card>
        </Section>
      </div>
    </>
  );
}