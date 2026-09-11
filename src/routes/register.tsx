import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/layout/Header";
import { register } from "@/api/auth";
import { seo } from "@/lib/seo";
import { APP_NAME } from "@/config";

export const Route = createFileRoute("/register")({
  head: () =>
    seo(
      "Register",
      "Create a citizen account for reporting and tracking public infrastructure issues.",
    ),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);

    try {
      await register({
        name: trimmedName,
        password,
      });

      await navigate({
        to: "/citizen",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
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
            Join the infrastructure accountability loop.
          </h1>

          <p className="mt-4 max-w-md text-sm text-navy-foreground/75">
            Create a citizen account to report infrastructure damage,
            provide evidence and track how your report moves through the{" "}
            {APP_NAME} lifecycle.
          </p>
        </div>

        <p className="text-xs text-navy-foreground/60">
          Citizen registration · Secure account · Public infrastructure
        </p>
      </aside>

      <main className="flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <div className="rounded-lg bg-navy p-3">
              <BrandMark />
            </div>
          </div>

          <div className="mt-6 flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
            <UserPlus className="size-5" aria-hidden="true" />
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            Create citizen account
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Register to report and track public infrastructure issues.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => void onSubmit(e)}
          >
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>

              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
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
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>

              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-critical">
                {error}
              </p>
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
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Your account will be registered as a citizen.
          </p>

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