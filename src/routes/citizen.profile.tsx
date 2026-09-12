import { createFileRoute } from "@tanstack/react-router";
import { User, ShieldCheck, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

type CitizenUser = {
  id: string;
  name: string;
  role: string;
  organisation?: string;
};

const USER_KEY = "infrasetu.user";

export const Route = createFileRoute("/citizen/profile")({
  component: CitizenProfile,
});

function CitizenProfile() {
  const [user, setUser] = useState<CitizenUser | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(USER_KEY);

      if (raw) {
        setUser(JSON.parse(raw) as CitizenUser);
      }
    } catch (error) {
      console.error("Unable to load citizen profile:", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl p-6">

        {/* Profile Header */}
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

        {/* Account Information */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-blue-600" />

            <h2 className="text-lg font-semibold text-slate-900">
              Account information
            </h2>
          </div>

          <div className="space-y-4">

            {/* Citizen ID */}
            <div>
              <p className="text-sm text-slate-500">
                Citizen ID
              </p>

              <p className="font-medium text-slate-900">
                {user?.id ?? "USR-0001"}
              </p>
            </div>

            {/* Name */}
            <div>
              <p className="text-sm text-slate-500">
                Name
              </p>

              <p className="font-medium text-slate-900">
                {user?.name ?? "Citizen User"}
              </p>
            </div>

            {/* Role */}
            <div>
              <p className="text-sm text-slate-500">
                Role
              </p>

              <p className="font-medium text-slate-900">
                {user?.role
                  ? user.role.charAt(0).toUpperCase() +
                    user.role.slice(1)
                  : "Citizen"}
              </p>
            </div>

            {/* Organisation */}
            <div>
              <p className="text-sm text-slate-500">
                Organisation
              </p>

              <p className="font-medium text-slate-900">
                {user?.organisation ?? "Maharashtra"}
              </p>
            </div>

            {/* Account Status */}
            <div>
              <p className="text-sm text-slate-500">
                Account status
              </p>

              <p className="font-medium text-green-600">
                Active
              </p>
            </div>

          </div>
        </div>

        {/* Sign Out */}
        <div className="mt-4 rounded-xl border bg-white p-6 shadow-sm">
          <button
            type="button"
            onClick={async () => {
              try {
                const { logout } = await import("@/api/auth");

                await logout();

                window.location.href = "/login";
              } catch (error) {
                console.error("Logout failed:", error);
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}