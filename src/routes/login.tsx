import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HardHat, Loader2, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/layout/Header";
import { login } from "@/api/auth";
import type { UserRole } from "@/types";
import { APP_NAME } from "@/config";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () =>
    seo("Sign in", "Secure sign-in for government officers, citizens and empanelled contractors."),
  component: LoginPage,
});

const ROLES: {
  role: UserRole;
  label: string;
  hint: string;
  icon: LucideIcon;
  idLabel: string;
  placeholder: string;
  to: "/admin/dashboard" | "/citizen" | "/contractor";
}[] = [
  {
    role: "admin",
    label: "Government officer",
    hint: "Command centre access",
    icon: ShieldCheck,
    idLabel: "Officer ID",
    placeholder: "GOV-ADMIN",
    to: "/admin/dashboard",
  },
  {
    role: "citizen",
    label: "Citizen",
    hint: "Report and track issues",
    icon: Users,
    idLabel: "Mobile number",
    placeholder: "9876543210",
    to: "/citizen",
  },
  {
    role: "contractor",
    label: "Contractor",
    hint: "Assigned work orders",
    icon: HardHat,
    idLabel: "Contractor ID",
    placeholder: "CON-01",
    to: "/contractor",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("admin");
  const [userId, setUserId] = useState("GOV-ADMIN");
  const [password, setPassword] = useState("demo1234");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const active = ROLES.find((r) => r.role === role)!;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login({ userId, password, role });
      await navigate({ to: active.to });
    } catch {
      setError("Sign-in failed. Check your credentials and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-navy p-10 text-navy-foreground lg:flex">
        <Link to="/landing">
          <BrandMark />
        </Link>
        <div>
          <h1 className="max-w-md text-4xl font-semibold tracking-tight">
            Accountable infrastructure, end to end.
          </h1>
          <p className="mt-4 max-w-md text-sm text-navy-foreground/75">
            Sign in to access the {APP_NAME} lifecycle platform — asset health, AI risk intelligence,
            work order execution and the public audit trail.
          </p>
        </div>
        <p className="text-xs text-navy-foreground/60">
          Demo environment · mock data mode · no real credentials required
        </p>
      </aside>

      <main className="flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <div className="rounded-lg bg-navy p-3">
              <BrandMark />
            </div>
          </div>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select your role to continue to the platform.
          </p>

          <fieldset className="mt-6">
            <legend className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Role
            </legend>
            <div className="grid gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const selected = r.role === role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setRole(r.role);
                      setUserId(r.placeholder);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                      selected
                        ? "border-primary bg-accent"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-md",
                        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="leading-tight">
                      <span className="block text-sm font-medium text-foreground">{r.label}</span>
                      <span className="block text-xs text-muted-foreground">{r.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <form className="mt-6 space-y-4" onSubmit={(e) => void onSubmit(e)}>
            <div className="space-y-1.5">
              <Label htmlFor="userId">{active.idLabel}</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={active.placeholder}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-critical">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/landing" className="hover:text-primary hover:underline">
              Back to overview
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
