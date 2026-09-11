import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { listComplaints } from "@/api/complaints";

export const Route = createFileRoute("/citizen/complaints")({
  component: CitizenComplaintsPage,
});

function CitizenComplaintsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["citizen-complaints"],
    queryFn: listComplaints,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border p-4">
        <p className="text-sm text-critical">
          Unable to load your reports.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-semibold">My Reports</h1>
        <p className="text-sm text-muted-foreground">
          Track the infrastructure issues you reported.
        </p>
      </div>

      {!data?.length ? (
        <div className="rounded-lg border border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            You have not submitted any reports yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((complaint) => (
            <Link
              key={complaint.id}
              to="/citizen/complaints/$complaintId"
              params={{ complaintId: complaint.id }}
              className="block rounded-lg border border-border p-4 hover:border-primary"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{complaint.issueType}</p>
                  <p className="text-xs text-muted-foreground">
                    {complaint.id}
                  </p>
                </div>

                <span className="text-xs font-medium">
                  {complaint.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {complaint.description}
              </p>

              {complaint.aiStatus && (
                <p className="mt-2 text-xs">
                  AI: {complaint.aiStatus}
                </p>
              )}

              {complaint.riskScore !== null &&
                complaint.riskScore !== undefined && (
                  <p className="mt-1 text-xs">
                    Risk score: {complaint.riskScore}
                  </p>
                )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
