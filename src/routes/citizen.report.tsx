import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Camera, Loader2, MapPin, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Section } from "@/components/ui/section";
import { ErrorState } from "@/components/ui/states";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssets } from "@/hooks/useInfraData";
import {
  runPipeline,
  submitComplaint,
  uploadImage,
} from "@/api/complaints";
import type { IssueType } from "@/types";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/citizen/report")({
  head: () =>
    seo(
      "Report an issue",
      "Submit a geo-tagged infrastructure issue for automated AI detection and risk scoring.",
    ),
  component: ReportPage,
});

const ISSUE_TYPES: IssueType[] = [
  "Pothole",
  "Crack",
  "Waterlogging",
  "Damaged barrier",
  "Road surface damage",
  "Other",
];

function ReportPage() {
  const navigate = useNavigate();
  const assets = useAssets();

  const [assetId, setAssetId] = useState("");
  const [issueType, setIssueType] = useState<IssueType>("Pothole");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [coords, setCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const asset = (assets.data ?? []).find((a) => a.id === assetId);

  function useAssetLocation() {
    if (!asset) {
      toast.error("Select the affected asset first.");
      return;
    }

    setCoords({
      lat: asset.latitude,
      lng: asset.longitude,
    });

    toast.success("Location attached from asset registry.");
  }

  function useDeviceLocation() {
    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      toast.error("Location services are unavailable on this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });

        toast.success("Current location captured.");
      },
      () =>
        toast.error(
          "Could not read your location. Attach the asset location instead.",
        ),
    );
  }

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10 MB.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setUploading(true);

    try {
      const uploaded = await uploadImage(file);

      setImageUrl(uploaded.url);

      toast.success("Image uploaded successfully.");
    } catch (error) {
      console.error(error);
      setSelectedFile(null);
      setImageUrl("");
      toast.error("Image upload failed. Please try again.");
      e.target.value = "";
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!asset) {
      toast.error("Select the affected asset.");
      return;
    }

    if (description.trim().length < 10) {
      toast.error(
        "Add a short description (at least 10 characters).",
      );
      return;
    }

    if (uploading) {
      toast.error("Please wait for the image upload to finish.");
      return;
    }

    const point = coords ?? {
      lat: asset.latitude,
      lng: asset.longitude,
    };

    setSubmitting(true);

    try {
      const complaint = await submitComplaint({
        assetId: asset.id,
        issueType,
        description: description.trim(),
        latitude: point.lat,
        longitude: point.lng,
        imageUrl: imageUrl || undefined,
      });

      toast.success("Report submitted", {
        description:
          "AI analysis and risk scoring have started.",
      });

      void runPipeline(complaint.id).then(() =>
        toast.success("AI analysis complete", {
          description:
            "A risk score has been assigned to your report.",
        }),
      );

      void navigate({
        to: "/citizen/complaints/$complaintId",
        params: {
          complaintId: complaint.id,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (assets.isError) {
    return (
      <ErrorState
        onRetry={() => void assets.refetch()}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Report an issue
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Geo-tagged reports are analysed automatically and
          escalated by risk.
        </p>
      </div>

      <Section title="Issue details">
        {assets.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-24" />
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => void handleSubmit(e)}
          >
            <div className="space-y-1.5">
              <Label htmlFor="asset">
                Affected asset
              </Label>

              <Select
                value={assetId}
                onValueChange={setAssetId}
              >
                <SelectTrigger id="asset">
                  <SelectValue placeholder="Select road, bridge or flyover" />
                </SelectTrigger>

                <SelectContent>
                  {(assets.data ?? []).map((a) => (
                    <SelectItem
                      key={a.id}
                      value={a.id}
                    >
                      {a.name} · {a.assetCode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="issue">
                Issue type
              </Label>

              <Select
                value={issueType}
                onValueChange={(v) =>
                  setIssueType(v as IssueType)
                }
              >
                <SelectTrigger id="issue">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {ISSUE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe what you observed, e.g. deep pothole in the left lane causing vehicles to swerve."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">
                Road image
              </Label>

              <Input
                id="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  void handleFileChange(e)
                }
                disabled={uploading || submitting}
              />

              {selectedFile && (
                <p className="text-xs text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}

              {uploading && (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" />
                  Uploading image...
                </p>
              )}

              {imageUrl && !uploading && (
                <p className="text-xs text-green-600">
                  ✓ Image uploaded and ready for AI analysis
                </p>
              )}
            </div>

            <div className="space-y-2 rounded-lg border border-border p-3">
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <MapPin
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                Location
              </p>

              <p className="text-xs text-muted-foreground">
                {coords
                  ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                  : "No location attached yet — the asset location will be used."}
              </p>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={useDeviceLocation}
                >
                  Use my location
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={useAssetLocation}
                >
                  Use asset location
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || uploading}
            >
              {submitting ? (
                <Loader2
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Camera
                  className="size-4"
                  aria-hidden="true"
                />
              )}

              {submitting
                ? "Submitting..."
                : uploading
                  ? "Uploading..."
                  : "Submit report"}
            </Button>
          </form>
        )}
      </Section>
    </div>
  );
}