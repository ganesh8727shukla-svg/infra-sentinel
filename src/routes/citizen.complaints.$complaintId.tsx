import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getComplaint } from "@/api/complaints";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/states";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/citizen/complaints/$complaintId")({
  head: () =>
    seo(
      "Complaint details",
      "Track your infrastructure complaint and its AI analysis status.",
    ),
  component: ComplaintDetailsPage,
});

function ComplaintDetailsPage() {
  const { complaintId } = Route.useParams();

  const complaint = useQuery({
    queryKey: ["complaint", complaintId],
    queryFn: () => getComplaint(complaintId),
  });

  if (complaint.isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (complaint.isError || !complaint.data) {
    return (
      <ErrorState
        onRetry={() => void complaint.refetch()}
      />
    );
  }

  const data = complaint.data;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/citizen">
          <Button variant="outline" size="sm">
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </Link>

        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Complaint details
          </h1>
          <p className="text-sm text-muted-foreground">
            {data.id}
          </p>
        </div>
      </div>

      <Section title="Report status">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <CheckCircle2 className="size-6 text-primary" />

            <div>
              <p className="font-medium text-foreground">
                {data.status}
              </p>
              <p className="text-sm text-muted-foreground">
                Your report is being processed through the InfraSetu workflow.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">
                Issue type
              </p>
              <p className="mt-1 font-medium text-foreground">
                {data.issueType}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">
                AI status
              </p>
              <p className="mt-1 font-medium text-foreground">
                {data.aiStatus}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">
                Risk score
              </p>
              <p className="mt-1 font-medium text-foreground">
                {data.riskScore ?? "Pending"}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">
                Submitted
              </p>
              <p className="mt-1 font-medium text-foreground">
                {new Date(data.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Your report">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Description
            </p>
            <p className="mt-1 text-sm text-foreground">
              {data.description}
            </p>
          </div>

          {data.imageUrl && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Uploaded image
              </p>

              <img
                src={data.imageUrl}
                alt="Infrastructure issue"
                className="max-h-80 w-full rounded-lg border border-border object-contain"
              />
            </div>
          )}

          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <MapPin className="mt-0.5 size-5 text-primary" />

            <div>
              <p className="font-medium text-foreground">
                Report location
              </p>
              <p className="text-sm text-muted-foreground">
                {data.latitude.toFixed(5)},{" "}
                {data.longitude.toFixed(5)}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Automated processing">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-primary" />

            <div>
              <p className="text-sm font-medium text-foreground">
                AI analysis
              </p>
              <p className="text-xs text-muted-foreground">
                {data.aiStatus}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock3 className="size-5 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium text-foreground">
                Risk assessment
              </p>
              <p className="text-xs text-muted-foreground">
                {data.riskScore !== null
                  ? `Risk score assigned: ${data.riskScore}`
                  : "Risk assessment pending"}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Link to="/citizen">
        <Button className="w-full">
          Back to citizen home
        </Button>
      </Link>
    </div>
  );
}