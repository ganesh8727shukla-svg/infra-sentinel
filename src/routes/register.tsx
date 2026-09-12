import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import { register } from "@/api/auth";
import { APP_NAME } from "@/config";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () =>
    seo(
      "Register",
      "Register as a citizen or empanelled contractor on InfraSetu.",
    ),
  component: RegisterPage,
});

type RegisterRole = "citizen" | "contractor";

const ROLES: {
  role: RegisterRole;
  label: string;
  hint: string;
  icon: LucideIcon;
}[] = [
  {
    role: "citizen",
    label: "Citizen",
    hint: "Report and track infrastructure issues",
    icon: Users,
  },
  {
    role: "contractor",
    label: "Contractor",
    hint: "Register your organisation for work orders",
    icon: HardHat,
  },
];

function RegisterPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState<RegisterRole>("citizen");

  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [district, setDistrict] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isContractor = role === "contractor";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);

    const cleanName = name.trim();
    const cleanOrganisation = organisation.trim();
    const cleanDistrict = district.trim();
    const cleanLicenseNumber = licenseNumber.trim().toUpperCase();

    // =========================================================
    // BASIC VALIDATION
    // =========================================================

    if (cleanName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // =========================================================
    // CONTRACTOR VALIDATION
    // =========================================================

    if (isContractor) {
      if (!cleanOrganisation) {
        setError("Organisation name is required for contractors.");
        return;
      }

      if (!cleanDistrict) {
        setError("Operating district is required for contractors.");
        return;
      }

      if (!cleanLicenseNumber) {
        setError(
          "Registration / License number is required for contractors.",
        );
        return;
      }

      /*
       * Required format:
       *
       * LIC-MH-2026-1234
       *
       * LIC  = fixed prefix
       * MH   = two uppercase letters
       * 2026 = four digit year
       * 1234 = four digit registration number
       *
       * Total length = 16 characters
       */

      const licensePattern =
        /^LIC-[A-Z]{2}-[0-9]{4}-[0-9]{4}$/;

      if (!licensePattern.test(cleanLicenseNumber)) {
        setError(
          "Invalid license format. Use format: LIC-MH-2026-1234",
        );
        return;
      }
    }

    setPending(true);

    try {
      // =======================================================
      // REGISTER
      // =======================================================

      const registeredUser = await register({
        name: cleanName,
        password,
        role,

        organisation: cleanOrganisation || undefined,

        district: isContractor
          ? cleanDistrict || undefined
          : undefined,

        licenseNumber: isContractor
          ? cleanLicenseNumber || undefined
          : undefined,
      });

      // =======================================================
      // GET GENERATED USER ID
      // =======================================================

      const generatedUserId = registeredUser?.id;

      if (!generatedUserId) {
        throw new Error(
          "Registration succeeded but no user ID was returned.",
        );
      }

      /*
       * Citizen:
       * USR-XXXXXXXX
       *
       * Contractor:
       * CON-XXXXXXXX
       */

      await navigate({
        to: "/login",
        search: {
          registered: "1",
          userId: generatedUserId,
          role,
        },
      });
    } catch (err) {
      console.error("Registration failed:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">

      {/* =====================================================
          LEFT GOVERNMENT PANEL
      ===================================================== */}

      <aside className="hidden flex-col justify-between bg-navy p-10 text-navy-foreground lg:flex">

        <Link to="/landing">
          <BrandMark />
        </Link>

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-foreground/60">
            Public Works Department
          </p>

          <h1 className="mt-4 max-w-md text-4xl font-semibold tracking-tight">
            Join the infrastructure accountability network.
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-navy-foreground/75">
            {APP_NAME} connects citizens, government authorities
            and verified contractors through a transparent
            infrastructure lifecycle.
          </p>

          <div className="mt-8 space-y-4">

            <VerificationPoint
              title="Citizen reporting"
              body="Submit geotagged infrastructure issues and follow their progress."
            />

            <VerificationPoint
              title="Contractor verification"
              body="Register your organisation and provide your operating and licence details."
            />

            <VerificationPoint
              title="Government controlled access"
              body="Government officers continue to use authorised sign-in credentials."
            />

          </div>

        </div>

        <p className="text-xs text-navy-foreground/60">
          {APP_NAME} · Infrastructure Intelligence Platform
        </p>

      </aside>

      {/* =====================================================
          REGISTRATION FORM
      ===================================================== */}

      <main className="flex items-center justify-center bg-background px-4 py-10 sm:px-6">

        <div className="w-full max-w-md">

          {/* MOBILE BRAND */}

          <div className="lg:hidden">
            <div className="rounded-lg bg-navy p-3">
              <BrandMark />
            </div>
          </div>

          {/* TITLE */}

          <div className="mt-6">

            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Create an account
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Select the account type appropriate for your role.
            </p>

          </div>

          {/* =================================================
              ROLE SELECTION
          ================================================= */}

          <fieldset className="mt-6">

            <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Account type
            </legend>

            <div className="grid gap-2 sm:grid-cols-2">

              {ROLES.map((item) => {

                const Icon = item.icon;
                const selected = item.role === role;

                return (
                  <button
                    key={item.role}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setRole(item.role);
                      setError(null);

                      // Clear contractor-only fields
                      // when switching to citizen.
                      if (item.role === "citizen") {
                        setDistrict("");
                        setLicenseNumber("");
                      }
                    }}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                      selected
                        ? "border-primary bg-accent"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >

                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-md",
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
                        {item.label}
                      </span>

                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {item.hint}
                      </span>

                    </span>

                  </button>
                );
              })}

            </div>

          </fieldset>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => void onSubmit(e)}
          >

            {/* =================================================
                NAME
            ================================================= */}

            <div className="space-y-1.5">

              <Label htmlFor="name">
                {isContractor
                  ? "Authorised representative name"
                  : "Full name"}
              </Label>

              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  isContractor
                    ? "Enter representative name"
                    : "Enter your full name"
                }
                autoComplete="name"
                required
              />

            </div>

            {/* =================================================
                CONTRACTOR FIELDS
            ================================================= */}

            {isContractor && (
              <>

                {/* VERIFICATION INFO */}

                <div className="rounded-lg border border-border bg-muted/40 p-4">

                  <div className="flex gap-3">

                    <ShieldCheck
                      className="mt-0.5 size-5 shrink-0 text-primary"
                    />

                    <div>

                      <p className="text-sm font-medium text-foreground">
                        Contractor verification
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Provide your organisation, operating
                        district and registration/license number
                        for contractor verification.
                      </p>

                    </div>

                  </div>

                </div>

                {/* ORGANISATION */}

                <div className="space-y-1.5">

                  <Label htmlFor="organisation">
                    Organisation / Company name
                  </Label>

                  <Input
                    id="organisation"
                    value={organisation}
                    onChange={(e) =>
                      setOrganisation(e.target.value)
                    }
                    placeholder="e.g. Apex Infrastructure Pvt. Ltd."
                    autoComplete="organization"
                    required
                  />

                </div>

                {/* DISTRICT */}

                <div className="space-y-1.5">

                  <Label htmlFor="district">
                    Operating district
                  </Label>

                  <Input
                    id="district"
                    value={district}
                    onChange={(e) =>
                      setDistrict(e.target.value)
                    }
                    placeholder="e.g. Thane"
                    required
                  />

                </div>

                {/* =================================================
                    LICENSE NUMBER
                ================================================= */}

                <div className="space-y-1.5">

                  <Label htmlFor="licenseNumber">
                    Registration / License number
                  </Label>

                  <Input
                    id="licenseNumber"
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => {
                      const value =
                        e.target.value.toUpperCase();

                      // IMPORTANT:
                      // LIC-MH-2026-1234 = 16 characters
                      if (value.length <= 16) {
                        setLicenseNumber(value);
                      }
                    }}
                    placeholder="LIC-MH-2026-1234"
                    maxLength={16}
                    autoComplete="off"
                    required
                    aria-describedby="license-format"
                  />

                  <p
                    id="license-format"
                    className="text-xs text-muted-foreground"
                  >
                    Format:{" "}
                    <span className="font-medium text-foreground">
                      LIC-MH-2026-1234
                    </span>
                  </p>

                </div>

              </>
            )}

            {/* =================================================
                CITIZEN AREA
            ================================================= */}

            {!isContractor && (
              <div className="space-y-1.5">

                <Label htmlFor="citizenOrganisation">
                  Organisation / Area
                  <span className="ml-1 text-muted-foreground">
                    (optional)
                  </span>
                </Label>

                <Input
                  id="citizenOrganisation"
                  value={organisation}
                  onChange={(e) =>
                    setOrganisation(e.target.value)
                  }
                  placeholder="e.g. Maharashtra"
                />

              </div>
            )}

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="space-y-1.5">

              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                required
              />

              <p className="text-xs text-muted-foreground">
                Use at least 8 characters.
              </p>

            </div>

            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            <div className="space-y-1.5">

              <Label htmlFor="confirmPassword">
                Confirm password
              </Label>

              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
              />

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-critical/20 bg-critical/5 px-3 py-2.5 text-sm text-critical"
              >
                {error}
              </div>
            )}

            {/* =================================================
                SUBMIT
            ================================================= */}

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
                ? "Creating account..."
                : isContractor
                  ? "Register contractor"
                  : "Register citizen"}

            </Button>

          </form>

          {/* =================================================
              LOGIN
          ================================================= */}

          <div className="mt-6 border-t border-border pt-5 text-center">

            <p className="text-sm text-muted-foreground">
              Already have an account?
            </p>

            <Button
              variant="outline"
              className="mt-2"
              asChild
            >
              <Link to="/login">
                Sign in
              </Link>
            </Button>

          </div>

          {/* GOVERNMENT MESSAGE */}

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Government officers use authorised credentials
            and do not register through this public form.
          </p>

          {/* BACK */}

          <p className="mt-4 text-center text-xs text-muted-foreground">

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

/* =============================================================
   VERIFICATION POINT
============================================================= */

function VerificationPoint({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3">

      <CheckCircle2
        className="mt-0.5 size-4 shrink-0"
      />

      <div>

        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-navy-foreground/65">
          {body}
        </p>

      </div>

    </div>
  );
}