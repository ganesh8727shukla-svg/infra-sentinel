import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Moon,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { me } from "@/api/auth";
import type { AppUser } from "@/types";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    void me().then(setUser);

    const savedTheme = localStorage.getItem("infrasetu.theme");
    setDarkMode(savedTheme === "dark");
  }, []);

  function toggleDarkMode() {
    const next = !darkMode;

    setDarkMode(next);
    localStorage.setItem("infrasetu.theme", next ? "dark" : "light");

    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your government account, preferences and application appearance."
        crumbs={[
          { label: "Admin", to: "/admin/dashboard" },
          { label: "Settings" },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Section
          title="User information"
          description="Details associated with your government administrator account."
        >
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="size-6" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">
                  {user?.name ?? "Government Administrator"}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Government Administrator
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      User ID
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {user?.id ?? "GOV-ADMIN"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Organisation
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {user?.organisation ?? "Public Works Department"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Role
                    </p>
                    <p className="mt-1 text-sm font-medium capitalize">
                      {user?.role ?? "admin"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Account status
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                      <CheckCircle2 className="size-4 text-healthy" />
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        <Section
          title="Appearance"
          description="Adjust how the government administration portal is displayed."
        >
          <Card className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                  {darkMode ? (
                    <Moon className="size-5" />
                  ) : (
                    <Sun className="size-5" />
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    Dark mode
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Use a darker interface for low-light environments.
                  </p>
                </div>
              </div>

              <Button
                variant={darkMode ? "default" : "outline"}
                size="sm"
                onClick={toggleDarkMode}
              >
                {darkMode ? "Enabled" : "Enable"}
              </Button>
            </div>
          </Card>
        </Section>

        <Section
          title="Security"
          description="Security information for your administrative account."
        >
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                <ShieldCheck className="size-5" />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Government administrator access
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Your account has administrative access to infrastructure,
                  complaints, work orders, analytics and audit records.
                </p>
              </div>
            </div>
          </Card>
        </Section>
      </div>
    </>
  );
}
