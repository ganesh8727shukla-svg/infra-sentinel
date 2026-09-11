import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, ShieldCheck, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { me, logout } from "@/api/auth";

type ProfileUser = {
  id: string;
  name: string;
  role: string;
  organisation?: string | null;
};

export const Route = createFileRoute("/citizen/profile")({
  component: CitizenProfile,
});

function CitizenProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const currentUser = await me();

        if (mounted) {
          setUser(currentUser);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your profile.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logout();
      await navigate({ to: "/login" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign out. Please try again.",
      );
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <User className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Citizen Profile
              </h1>

              <p className="text-slate-500">
                Manage your InfraSetu account
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-blue-600" />

            <h2 className="text-lg font-semibold text-slate-900">
              Account information
            </h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="h-5 w-48 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ) : user ? (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-slate-500">Full name</p>

                <p className="font-medium text-slate-900">
                  {user.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Citizen ID</p>

                <p className="font-medium text-slate-900">
                  {user.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Role</p>

                <p className="font-medium capitalize text-slate-900">
                  {user.role}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Organisation</p>

                <p className="font-medium text-slate-900">
                  {user.organisation || "Citizen"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Account status</p>

                <p className="font-medium text-green-600">
                  Active
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-5 rounded-xl border border-red-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Account actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sign out of your InfraSetu citizen account on this device.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-4 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            disabled={loggingOut}
            onClick={() => void handleLogout()}
          >
            <LogOut className="size-4" aria-hidden="true" />

            {loggingOut ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      </div>
    </div>
  );
}