import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Camera, Home, ListChecks, UserRound } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import type { MobileNavItem } from "@/components/layout/MobileShell";
import { useMockStoreSync } from "@/hooks/useInfraData";

export const Route = createFileRoute("/citizen")({
  component: CitizenLayout,
});

const NAV: MobileNavItem[] = [
  { label: "Home", to: "/citizen", icon: Home, exact: true },
  { label: "Report", to: "/citizen/report", icon: Camera },
  { label: "My reports", to: "/citizen/complaints", icon: ListChecks },
  { label: "Profile", to: "/citizen/profile", icon: UserRound },
];

function CitizenLayout() {
  useMockStoreSync();
  return (
    <MobileShell title="Citizen" subtitle="Report issues. Track resolution." items={NAV}>
      <Outlet />
    </MobileShell>
  );
}
