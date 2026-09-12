import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  Globe,
  LogOut,
  Menu,
  PanelLeft,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notifications } from "@/data/mock";
import { APP_NAME, APP_TAGLINE, LANGUAGES } from "@/config";
import { LEVEL_HEX, timeAgo } from "@/utils/format";
import { logout } from "@/api/auth";

export function BrandMark({ subtitle = true }: { subtitle?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-md bg-brand-blue text-navy-foreground">
        <ShieldCheck className="size-5" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight text-navy-foreground">
          {APP_NAME}
        </span>
        {subtitle && (
          <span className="block text-[11px] text-navy-foreground/70">{APP_TAGLINE}</span>
        )}
      </span>
    </div>
  );
}

export function Header({
  onToggleSidebar,
  onOpenMobileNav,
}: {
  onToggleSidebar?: () => void;
  onOpenMobileNav?: () => void;
}) {
  const [lang, setLang] = useState("English");
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 bg-navy px-3 text-navy-foreground sm:px-4">
      {onOpenMobileNav && (
        <Button
          variant="ghost"
          size="icon"
          className="text-navy-foreground hover:bg-navy-2 lg:hidden"
          aria-label="Open navigation"
          onClick={onOpenMobileNav}
        >
          <Menu className="size-5" />
        </Button>
      )}
      {onToggleSidebar && (
        <Button
          variant="ghost"
          size="icon"
          className="hidden text-navy-foreground hover:bg-navy-2 lg:inline-flex"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
        >
          <PanelLeft className="size-5" />
        </Button>
      )}

      <Link to="/" className="shrink-0">
        <BrandMark />
      </Link>

      <div className="relative ml-auto hidden max-w-xs flex-1 md:block">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-navy-foreground/60"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search assets, work orders…"
          aria-label="Search"
          className="h-9 border-white/15 bg-white/10 pl-8 text-sm text-navy-foreground placeholder:text-navy-foreground/60 focus-visible:ring-white/40"
        />
      </div>

      <div className="ml-auto flex items-center gap-0.5 md:ml-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-navy-foreground hover:bg-navy-2"
              aria-label={`Notifications, ${notifications.length} unread`}
            >
              <Bell className="size-5" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-moderate" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2">
                <span className="flex w-full items-center gap-2 text-sm font-medium">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: LEVEL_HEX[n.level] }}
                    aria-hidden="true"
                  />
                  {n.title}
                </span>
                <span className="pl-4 text-xs text-muted-foreground">
                  {n.detail} · {timeAgo(n.time)}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="hidden text-navy-foreground hover:bg-navy-2 sm:inline-flex"
          aria-label="Help"
          asChild
        >
          <Link to="/admin/audit">
            <CircleHelp className="size-5" />
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hidden gap-1 px-2 text-navy-foreground hover:bg-navy-2 sm:inline-flex"
              aria-label={`Language: ${lang}`}
            >
              <Globe className="size-4" />
              <span className="text-xs">{lang}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {LANGUAGES.map((l) => (
              <DropdownMenuItem key={l.code} onSelect={() => setLang(l.label)}>
                {l.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2 text-navy-foreground hover:bg-navy-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-white/15">
                <UserRound className="size-4" aria-hidden="true" />
              </span>
              <span className="hidden text-left leading-tight lg:block">
                <span className="block text-xs font-medium">Government Administrator</span>
                <span className="block text-[11px] text-navy-foreground/70">
                  Public Works Department
                </span>
              </span>
              <ChevronDown className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Government Administrator</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/citizen">Switch to citizen view</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/contractor">Switch to contractor view</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                void logout().then(() => navigate({ to: "/login" }));
              }}
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
