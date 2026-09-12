import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  HardHat,
  LogOut,
  MapPin,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/layout/Header";
import { APP_NAME } from "@/config";

export const Route = createFileRoute("/contractor")({
  component: ContractorPage,
});

function ContractorPage() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");

    void navigate({
      to: "/login",
      search: {
        role: "contractor",
      },
    });
  }

  return (
    <div className="min-h-screen bg-background">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-border bg-card">

        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* BRAND */}

          <Link to="/landing" className="flex items-center">
            <BrandMark />
          </Link>

          {/* RIGHT */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Notifications"
            >
              <Bell className="size-5" />

              <span className="absolute right-1 top-1 flex size-2 rounded-full bg-primary" />
            </button>

            <div className="hidden h-8 w-px bg-border sm:block" />

            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-foreground">
                Contractor Portal
              </p>

              <p className="text-xs text-muted-foreground">
                Empanelled Contractor
              </p>
            </div>

            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
              <HardHat className="size-5 text-primary" />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title="Sign out"
            >
              <LogOut className="size-5" />
            </Button>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <HardHat className="size-5 text-primary" />
              </span>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Contractor Portal
                </p>

                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Work Order Command Centre
                </h1>

              </div>

            </div>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Manage assigned infrastructure work orders, update repair
              progress and submit completion evidence to {APP_NAME}.
            </p>

          </div>


          {/* CONTRACTOR STATUS */}

          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">

            <CheckCircle2 className="size-5 text-primary" />

            <div>
              <p className="text-xs text-muted-foreground">
                Contractor status
              </p>

              <p className="text-sm font-semibold text-foreground">
                Active / Verified
              </p>
            </div>

          </div>

        </div>


        {/* =====================================================
            CONTRACTOR PROFILE
        ===================================================== */}

        <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="size-6 text-primary" />
              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Registered organisation
                </p>

                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  Apex Infrastructure Pvt. Ltd.
                </h2>

                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">

                  <span>
                    Contractor ID:{" "}
                    <strong className="text-foreground">
                      CON-A7F42C91
                    </strong>
                  </span>

                  <span>
                    License:{" "}
                    <strong className="text-foreground">
                      LIC-MH-2026-1234
                    </strong>
                  </span>

                  <span>
                    District:{" "}
                    <strong className="text-foreground">
                      Thane
                    </strong>
                  </span>

                </div>

              </div>

            </div>


            <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">

              <ShieldCheck className="size-4 text-primary" />

              <span className="text-xs font-medium text-primary">
                License Verified
              </span>

            </div>

          </div>

        </div>


        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Assigned"
            value="08"
            description="Total work orders"
            icon={ClipboardList}
          />

          <StatCard
            title="In Progress"
            value="03"
            description="Currently active"
            icon={Wrench}
          />

          <StatCard
            title="Completed"
            value="24"
            description="Successfully completed"
            icon={CheckCircle2}
          />

          <StatCard
            title="Pending"
            value="02"
            description="Awaiting action"
            icon={Clock3}
          />

        </div>


        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">


          {/* =================================================
              WORK ORDERS
          ================================================= */}

          <section className="lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-foreground">
                  Assigned Work Orders
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Latest infrastructure repair assignments
                </p>

              </div>

              <Button variant="outline" size="sm">
                View all
              </Button>

            </div>


            <div className="mt-4 space-y-3">

              <WorkOrderCard
                id="WO-2026-00481"
                title="Pothole repair — Station Road"
                location="Thane West"
                priority="Critical"
                status="In Progress"
                due="18 Sep 2026"
              />

              <WorkOrderCard
                id="WO-2026-00479"
                title="Road surface crack repair"
                location="Ghodbunder Road"
                priority="High"
                status="Assigned"
                due="20 Sep 2026"
              />

              <WorkOrderCard
                id="WO-2026-00472"
                title="Waterlogging drainage correction"
                location="Majiwada"
                priority="Medium"
                status="Awaiting Start"
                due="22 Sep 2026"
              />

              <WorkOrderCard
                id="WO-2026-00465"
                title="Footpath reconstruction"
                location="Kalyan Road"
                priority="Medium"
                status="Completed"
                due="Completed"
              />

            </div>

          </section>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section>

            <h2 className="text-lg font-semibold text-foreground">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Contractor operations
            </p>


            <div className="mt-4 space-y-3">

              <QuickAction
                icon={ClipboardList}
                title="My Work Orders"
                description="View assigned repair work"
              />

              <QuickAction
                icon={Wrench}
                title="Update Progress"
                description="Submit work progress"
              />

              <QuickAction
                icon={FileText}
                title="Completion Evidence"
                description="Upload before / after proof"
              />

              <QuickAction
                icon={BarChart3}
                title="Performance"
                description="View contractor performance"
              />

            </div>


            {/* DEADLINE ALERT */}

            <div className="mt-6 rounded-xl border border-border bg-card p-4">

              <div className="flex gap-3">

                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-critical/10">
                  <AlertTriangle className="size-5 text-critical" />
                </div>

                <div>

                  <p className="text-sm font-semibold text-foreground">
                    Deadline reminder
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    1 critical work order is approaching its completion
                    deadline.
                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>


        {/* =====================================================
            RECENT ACTIVITY
        ===================================================== */}

        <section className="mt-8">

          <div>

            <h2 className="text-lg font-semibold text-foreground">
              Recent Activity
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Recent updates from your contractor account
            </p>

          </div>


          <div className="mt-4 rounded-xl border border-border bg-card">

            <ActivityRow
              icon={CheckCircle2}
              title="Work order completed"
              description="WO-2026-00465 — Footpath reconstruction"
              time="Today, 10:42 AM"
            />

            <ActivityRow
              icon={Wrench}
              title="Progress updated"
              description="WO-2026-00481 — Repair work 60% complete"
              time="Yesterday, 4:18 PM"
            />

            <ActivityRow
              icon={FileText}
              title="Completion evidence uploaded"
              description="WO-2026-00465 — Before / after images submitted"
              time="10 Sep 2026"
            />

            <ActivityRow
              icon={Bell}
              title="New work order assigned"
              description="WO-2026-00479 — Road surface crack repair"
              time="9 Sep 2026"
            />

          </div>

        </section>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="mt-10 border-t border-border pt-6">

          <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">

            <p>
              {APP_NAME} · Infrastructure Intelligence Platform
            </p>

            <p>
              Contractor Portal · Secure Access
            </p>

          </div>

        </footer>

      </main>

    </div>
  );
}


/* =============================================================
   STAT CARD
============================================================= */

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof ClipboardList;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5 text-primary" />
        </div>

        <span className="text-2xl font-semibold text-foreground">
          {value}
        </span>

      </div>

      <p className="mt-4 text-sm font-medium text-foreground">
        {title}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>

    </div>
  );
}


/* =============================================================
   WORK ORDER CARD
============================================================= */

function WorkOrderCard({
  id,
  title,
  location,
  priority,
  status,
  due,
}: {
  id: string;
  title: string;
  location: string;
  priority: string;
  status: string;
  due: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex gap-3">

          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Wrench className="size-5 text-primary" />
          </div>

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <span className="text-xs font-semibold text-muted-foreground">
                {id}
              </span>

              <span
                className={
                  priority === "Critical"
                    ? "rounded-full bg-critical/10 px-2 py-0.5 text-[10px] font-semibold text-critical"
                    : priority === "High"
                      ? "rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-600"
                      : "rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                }
              >
                {priority}
              </span>

            </div>

            <h3 className="mt-1 text-sm font-semibold text-foreground">
              {title}
            </h3>

            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" />
              {location}
            </div>

          </div>

        </div>


        <div className="sm:text-right">

          <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {status}
          </span>

          <p className="mt-2 text-xs text-muted-foreground">
            Due: {due}
          </p>

        </div>

      </div>

    </div>
  );
}


/* =============================================================
   QUICK ACTION
============================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ClipboardList;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent"
    >

      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-4 text-primary" />
      </span>

      <span>

        <span className="block text-sm font-medium text-foreground">
          {title}
        </span>

        <span className="mt-0.5 block text-xs text-muted-foreground">
          {description}
        </span>

      </span>

    </button>
  );
}


/* =============================================================
   ACTIVITY ROW
============================================================= */

function ActivityRow({
  icon: Icon,
  title,
  description,
  time,
}: {
  icon: typeof CheckCircle2;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-border p-4 last:border-b-0">

      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-medium text-foreground">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {description}
        </p>

      </div>

      <p className="shrink-0 text-xs text-muted-foreground">
        {time}
      </p>

    </div>
  );
}