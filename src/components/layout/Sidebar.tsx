import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Building2,
  CircleHelp,
  ClipboardList,
  FileClock,
  LayoutDashboard,
  Map,
  Satellite,
  Settings,
  TriangleAlert,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  to: LinkProps["to"];
  icon: LucideIcon;
}

export const MAIN_NAV: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Infrastructure", to: "/admin/assets", icon: Building2 },
  { label: "GIS & Map", to: "/admin/map", icon: Map },
  { label: "Satellite Intelligence", to: "/admin/satellite", icon: Satellite },
  { label: "Risk & Alerts", to: "/admin/alerts", icon: TriangleAlert },
  { label: "Complaints", to: "/admin/complaints", icon: ClipboardList },
  { label: "Work Orders", to: "/admin/work-orders", icon: Wrench },
  { label: "Contractors", to: "/admin/contractors", icon: Users },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Audit Trail", to: "/admin/audit", icon: FileClock },
];

const BOTTOM_NAV: NavItem[] = [
  { label: "Settings", to: "/admin/analytics", icon: Settings },
  { label: "Help", to: "/admin/audit", icon: CircleHelp },
];

function NavLink({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;
  const link = (
    <Link
      to={item.to}
      onClick={onNavigate}
      activeProps={{
        className: "bg-sidebar-accent text-sidebar-accent-foreground",
        "aria-current": "page",
      }}
      className={cn(
        "flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium text-sidebar-foreground transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {collapsed && <span className="sr-only">{item.label}</span>}
    </Link>
  );
  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

export function SidebarNav({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <nav aria-label="Main" className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {!collapsed && (
          <p className="px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-sidebar-foreground/50 uppercase">
            Command
          </p>
        )}
        {MAIN_NAV.map((item) => (
          <NavLink key={item.label} item={item} collapsed={collapsed} {...(onNavigate ? { onNavigate } : {})} />
        ))}
      </nav>
      <div className="space-y-0.5 border-t border-sidebar-border p-2">
        {BOTTOM_NAV.map((item) => (
          <NavLink key={item.label} item={item} collapsed={collapsed} {...(onNavigate ? { onNavigate } : {})} />
        ))}
        {!collapsed && (
          <p className="flex items-center gap-1.5 px-2.5 pt-2 text-[11px] text-sidebar-foreground/50">
            <Activity className="size-3" aria-hidden="true" />
            Mock data mode
          </p>
        )}
      </div>
    </div>
  );
}
