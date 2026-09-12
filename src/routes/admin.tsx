import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useMockStoreSync } from "@/hooks/useInfraData";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  useMockStoreSync();
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
