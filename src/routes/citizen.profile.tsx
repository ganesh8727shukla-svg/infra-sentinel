import { createFileRoute } from "@tanstack/react-router";
import { User, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/citizen/profile")({
  component: CitizenProfile,
});

function CitizenProfile() {
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

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Citizen ID</p>
              <p className="font-medium text-slate-900">USR-0001</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Role</p>
              <p className="font-medium text-slate-900">Citizen</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Account status</p>
              <p className="font-medium text-green-600">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}