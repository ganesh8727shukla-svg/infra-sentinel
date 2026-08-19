import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/config";

export interface MobileNavItem {
  label: string;
  to: LinkProps["to"];
  icon: LucideIcon;
  exact?: boolean;
}

export function MobileShell({
  title,
  subtitle,
  items,
  children,
}: {
  title: string;
  subtitle: string;
  items: MobileNavItem[];
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2.5 bg-navy px-4 text-navy-foreground">
        <span className="flex size-8 items-center justify-center rounded-md bg-brand-blue">
          <ShieldCheck className="size-4" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">
            {APP_NAME} <span className="font-normal text-navy-foreground/70">· {title}</span>
          </p>
          <p className="text-[11px] text-navy-foreground/70">{subtitle}</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-5">{children}</main>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card"
      >
        <ul className="mx-auto flex max-w-2xl">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label} className="flex-1">
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.exact ?? false }}
                  activeProps={{ className: "text-primary", "aria-current": "page" }}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
