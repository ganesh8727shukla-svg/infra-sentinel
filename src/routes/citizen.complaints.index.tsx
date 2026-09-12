import { createFileRoute, Link } from "@tanstack/react-router";
import { useComplaints } from "@/hooks/useInfraData";
import { FileText, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/citizen/complaints/")({
  component: CitizenComplaints,
});

function CitizenComplaints() {
  const { data: complaints, isLoading, error } = useComplaints();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            My Reports
          </h1>
          <p className="mt-1 text-slate-500">
            Track the status of infrastructure issues you reported.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              Loading your reports...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
            <FileText className="mx-auto mb-3 h-10 w-10 text-slate-400" />

            <h2 className="text-lg font-semibold text-slate-900">
              Unable to load reports
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please try again in a moment.
            </p>
          </div>
        ) : complaints && complaints.length > 0 ? (
          <div className="space-y-3">
            {complaints.map((complaint) => (
              <Link
                key={complaint.id}
                to="/citizen/complaints/$complaintId"
                params={{ complaintId: complaint.id }}
                className="block rounded-xl border bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {complaint.issueType}
                    </p>

                    <h2 className="mt-1 font-semibold text-slate-900">
                      {complaint.description}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Reported on{" "}
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {complaint.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Risk:{" "}
                    {complaint.riskScore !== null
                      ? complaint.riskScore
                      : "Pending"}
                  </span>

                  <span className="inline-flex items-center gap-1 font-medium text-slate-900">
                    View report
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
            <FileText className="mx-auto mb-3 h-10 w-10 text-slate-400" />

            <h2 className="text-lg font-semibold text-slate-900">
              No reports yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your submitted infrastructure reports will appear here.
            </p>

            <Link
              to="/citizen/report"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Report an issue
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
