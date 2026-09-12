import { useEffect, useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";

import {
  CheckCircle2,
  HardHat,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";

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
  validateSearch: (search: Record<string, unknown>) => {
    return {
      userId:
        typeof search.userId === "string"
          ? search.userId
          : undefined,

      role:
        search.role === "admin" ||
        search.role === "citizen" ||
        search.role === "contractor"
          ? search.role
          : undefined,

      registered:
        search.registered === "1"
          ? "1"
          : undefined,
    };
  },

  head: () =>
    seo(
      "Sign in",
      "Secure sign-in for government officers, citizens and empanelled contractors.",
    ),

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
    idLabel: "Citizen ID",
    placeholder: "USR-XXXXXXXX",
    to: "/citizen",
  },

  {
    role: "contractor",
    label: "Contractor",
    hint: "Assigned work orders",
    icon: HardHat,
    idLabel: "Contractor ID",
    placeholder: "CON-XXXXXXXX",
    to: "/contractor",
  },
];


function LoginPage() {
  const navigate = useNavigate();

  const search = useSearch({
    from: "/login",
  });

  const registeredUserId = search.userId;
  const registeredRole = search.role;

  /*
   * If the page is opened after registration,
   * restrict the page to that registered role.
   *
   * Otherwise show normal role selection.
   */

  const isRestrictedLogin =
    registeredRole === "citizen" ||
    registeredRole === "contractor";

  const [role, setRole] = useState<UserRole>(
    registeredRole ?? "admin",
  );

  const [userId, setUserId] = useState(
    registeredUserId ?? "GOV-ADMIN",
  );

  const [password, setPassword] = useState("");

  const [pending, setPending] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [registrationMessage, setRegistrationMessage] =
    useState<string | null>(null);


  useEffect(() => {
    if (registeredRole) {
      setRole(registeredRole);
    }

    if (registeredUserId) {
      setUserId(registeredUserId);
    }

    if (
      search.registered === "1" &&
      registeredUserId
    ) {
      setRegistrationMessage(
        `Registration successful. Your ${
          registeredRole === "contractor"
            ? "Contractor"
            : "Citizen"
        } ID is ${registeredUserId}.`,
      );
    }
  }, [
    registeredRole,
    registeredUserId,
    search.registered,
  ]);


  /*
   * Only show the relevant role when the user
   * has just registered.
   *
   * Normal /login still shows all three.
   */

  const visibleRoles = isRestrictedLogin
    ? ROLES.filter(
        (item) => item.role === registeredRole,
      )
    : ROLES;


  const active =
    ROLES.find(
      (item) => item.role === role,
    )!;


  async function onSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    setError(null);
    setPending(true);

    try {
      await login({
        userId: userId.trim(),
        password,
        role,
      });

      await navigate({
        to: active.to,
      });
    } catch (err) {
      console.error(
        "Sign-in failed:",
        err,
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Sign-in failed. Check your credentials and try again.",
        );
      }
    } finally {
      setPending(false);
    }
  }


  return (
    <div className="grid min-h-screen lg:grid-cols-2">

      {/* LEFT GOVERNMENT PANEL */}

      <aside className="hidden flex-col justify-between bg-navy p-10 text-navy-foreground lg:flex">

        <Link to="/landing">
          <BrandMark />
        </Link>

        <div>

          <h1 className="max-w-md text-4xl font-semibold tracking-tight">
            Accountable infrastructure, end to end.
          </h1>

          <p className="mt-4 max-w-md text-sm text-navy-foreground/75">
            Sign in to access the {APP_NAME} lifecycle
            platform — asset health, AI risk intelligence,
            work order execution and the public audit trail.
          </p>

        </div>

        <p className="text-xs text-navy-foreground/60">
          Secure government infrastructure platform
        </p>

      </aside>


      {/* LOGIN */}

      <main className="flex items-center justify-center bg-background px-4 py-12">

        <div className="w-full max-w-sm">

          <div className="lg:hidden">
            <div className="rounded-lg bg-navy p-3">
              <BrandMark />
            </div>
          </div>


          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
            Sign in
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isRestrictedLogin
              ? "Sign in using the account you just created."
              : "Select your role to continue to the platform."}
          </p>


          {/* REGISTRATION SUCCESS */}

          {registrationMessage && (
            <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4">

              <div className="flex gap-3">

                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />

                <div>

                  <p className="text-sm font-semibold text-foreground">
                    Account created successfully
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Your login ID is:
                  </p>

                  <p className="mt-1 text-lg font-bold tracking-wide text-primary">
                    {registeredUserId}
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Your ID has been filled automatically.
                    Enter the password you created during
                    registration.
                  </p>

                </div>

              </div>

            </div>
          )}


          {/* ROLE */}

          <fieldset className="mt-6">

            {!isRestrictedLogin && (
              <legend className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Role
              </legend>
            )}

            <div className="grid gap-2">

              {visibleRoles.map((r) => {

                const Icon = r.icon;

                const selected =
                  r.role === role;

                return (
                  <button
                    key={r.role}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {

                      if (isRestrictedLogin) {
                        return;
                      }

                      setRole(r.role);

                      setUserId(
                        r.placeholder,
                      );

                      setError(null);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",

                      selected
                        ? "border-primary bg-accent"
                        : "border-border bg-card hover:border-primary/40",

                      isRestrictedLogin &&
                        "cursor-default",
                    )}
                  >

                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-md",

                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >

                      <Icon
                        className="size-4"
                        aria-hidden="true"
                      />

                    </span>


                    <span className="leading-tight">

                      <span className="block text-sm font-medium text-foreground">
                        {r.label}
                      </span>

                      <span className="block text-xs text-muted-foreground">
                        {r.hint}
                      </span>

                    </span>

                  </button>
                );
              })}

            </div>

          </fieldset>


          {/* LOGIN FORM */}

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) =>
              void onSubmit(e)
            }
          >

            <div className="space-y-1.5">

              <Label htmlFor="userId">
                {active.idLabel}
              </Label>

              <Input
                id="userId"
                value={userId}
                onChange={(e) =>
                  setUserId(
                    e.target.value,
                  )
                }
                placeholder={
                  active.placeholder
                }
                required
              />

            </div>


            <div className="space-y-1.5">

              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value,
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

            </div>


            {error && (
              <div
                role="alert"
                className="rounded-lg border border-critical/20 bg-critical/5 px-3 py-2.5 text-sm text-critical"
              >
                {error}
              </div>
            )}


            <Button
              type="submit"
              className="w-full"
              disabled={pending}
            >

              {pending && (
                <Loader2
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              )}

              {pending
                ? "Signing in..."
                : "Sign in"}

            </Button>

          </form>


          {/* REGISTER */}

          {!isRestrictedLogin && (
            <div className="mt-6 border-t border-border pt-5 text-center">

              <p className="text-sm text-muted-foreground">
                Don't have an account?
              </p>

              <Button
                variant="outline"
                className="mt-2"
                asChild
              >
                <Link to="/register">
                  Register as citizen or contractor
                </Link>
              </Button>

            </div>
          )}


          <p className="mt-6 text-center text-xs text-muted-foreground">

            <Link
              to="/landing"
              className="hover:text-primary hover:underline"
            >
              Back to overview
            </Link>

          </p>

        </div>

      </main>

    </div>
  );
}