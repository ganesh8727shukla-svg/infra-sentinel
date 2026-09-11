import { useState } from "react";

import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import { toast } from "sonner";

import {
  Camera,
  Loader2,
  MapPin,
} from "lucide-react";

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
  submitComplaint,
  uploadImage,
} from "@/api/complaints";

import type { IssueType } from "@/types";

import { seo } from "@/lib/seo";


// -----------------------------------------------------------------------------
// ROUTE
// -----------------------------------------------------------------------------

export const Route =
  createFileRoute(
    "/citizen/report",
  )({
    head: () =>
      seo(
        "Report an issue",
        "Submit a geo-tagged infrastructure issue for automated AI detection and risk scoring.",
      ),

    component:
      ReportPage,
  });


// -----------------------------------------------------------------------------
// ISSUE TYPES
// -----------------------------------------------------------------------------

const ISSUE_TYPES: IssueType[] = [
  "Pothole",
  "Crack",
  "Waterlogging",
  "Damaged barrier",
  "Road surface damage",
  "Other",
];


// -----------------------------------------------------------------------------
// PAGE
// -----------------------------------------------------------------------------

function ReportPage() {
  const navigate =
    useNavigate();

  const assets =
    useAssets();

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [
    assetId,
    setAssetId,
  ] = useState("");

  const [
    issueType,
    setIssueType,
  ] =
    useState<IssueType>(
      "Pothole",
    );

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    imageUrl,
    setImageUrl,
  ] = useState("");

  const [
    selectedFile,
    setSelectedFile,
  ] =
    useState<File | null>(
      null,
    );

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    coords,
    setCoords,
  ] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  // ---------------------------------------------------------------------------
  // SELECTED ASSET
  // ---------------------------------------------------------------------------

  const asset =
    (assets.data ?? [])
      .find(
        (item) =>
          item.id === assetId,
      );


  // ---------------------------------------------------------------------------
  // USE ASSET LOCATION
  // ---------------------------------------------------------------------------

  function useAssetLocation() {
    if (!asset) {
      toast.error(
        "Select the affected asset first.",
      );

      return;
    }

    setCoords({
      lat: asset.latitude,
      lng: asset.longitude,
    });

    toast.success(
      "Location attached from asset registry.",
    );
  }


  // ---------------------------------------------------------------------------
  // USE DEVICE LOCATION
  // ---------------------------------------------------------------------------

  function useDeviceLocation() {
    if (
      typeof navigator ===
        "undefined" ||
      !navigator.geolocation
    ) {
      toast.error(
        "Location services are unavailable on this device.",
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat:
            position.coords
              .latitude,

          lng:
            position.coords
              .longitude,
        });

        toast.success(
          "Current location captured.",
        );
      },

      (error) => {
        console.error(
          "Geolocation error:",
          error,
        );

        toast.error(
          "Could not read your location. Attach the asset location instead.",
        );
      },
    );
  }


  // ---------------------------------------------------------------------------
  // IMAGE UPLOAD
  // ---------------------------------------------------------------------------

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // -------------------------------------------------------------------------
    // Validate type
    // -------------------------------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type,
      )
    ) {
      toast.error(
        "Please select a JPG, PNG, or WebP image.",
      );

      event.target.value = "";

      return;
    }

    // -------------------------------------------------------------------------
    // Validate size
    // -------------------------------------------------------------------------

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      toast.error(
        "Image must be smaller than 10 MB.",
      );

      event.target.value = "";

      return;
    }

    setSelectedFile(file);
    setUploading(true);

    try {
      const uploaded =
        await uploadImage(
          file,
        );

      // Save the URL returned by FastAPI.
      setImageUrl(
        uploaded.url,
      );

      toast.success(
        "Image uploaded successfully.",
      );
    } catch (error) {
      console.error(
        "Image upload error:",
        error,
      );

      setSelectedFile(null);
      setImageUrl("");

      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed. Please try again.",
      );

      event.target.value = "";
    } finally {
      setUploading(false);
    }
  }


  // ---------------------------------------------------------------------------
  // SUBMIT REPORT
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    // -------------------------------------------------------------------------
    // Validate asset
    // -------------------------------------------------------------------------

    if (!asset) {
      toast.error(
        "Select the affected asset.",
      );

      return;
    }

    // -------------------------------------------------------------------------
    // Validate description
    // -------------------------------------------------------------------------

    const cleanDescription =
      description.trim();

    if (
      cleanDescription.length <
      10
    ) {
      toast.error(
        "Add a short description (at least 10 characters).",
      );

      return;
    }

    // -------------------------------------------------------------------------
    // Wait for image upload
    // -------------------------------------------------------------------------

    if (uploading) {
      toast.error(
        "Please wait for the image upload to finish.",
      );

      return;
    }

    // -------------------------------------------------------------------------
    // Location
    // -------------------------------------------------------------------------

    const point =
      coords ?? {
        lat: asset.latitude,
        lng: asset.longitude,
      };

    // -------------------------------------------------------------------------
    // Submit
    // -------------------------------------------------------------------------

    setSubmitting(true);

    try {
      console.log(
        "[InfraSetu] Submitting report:",
        {
          assetId: asset.id,
          issueType,
          description:
            cleanDescription,
          latitude: point.lat,
          longitude: point.lng,
          imageUrl:
            imageUrl || null,
        },
      );

      const complaint =
        await submitComplaint({
          assetId: asset.id,
          issueType,
          description:
            cleanDescription,

          latitude:
            point.lat,

          longitude:
            point.lng,

          imageUrl:
            imageUrl || undefined,
        });

      console.log(
        "[InfraSetu] Report created:",
        complaint,
      );

      // -----------------------------------------------------------------------
      // Success
      // -----------------------------------------------------------------------

      toast.success(
        "Report submitted successfully!",
        {
          description:
            "AI analysis and risk scoring have started.",
        },
      );

      // -----------------------------------------------------------------------
      // Navigate to complaint details.
      //
      // The backend already runs the AI/risk/work-order pipeline.
      // No second pipeline request is necessary.
      // -----------------------------------------------------------------------

      await navigate({
        to:
          "/citizen/complaints/$complaintId",

        params: {
          complaintId:
            complaint.id,
        },
      });

    } catch (error) {
      console.error(
        "[InfraSetu] Report submission error:",
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : "Submission failed. Please try again.";

      toast.error(
        "Report submission failed",
        {
          description:
            message,
        },
      );
    } finally {
      setSubmitting(false);
    }
  }


  // ---------------------------------------------------------------------------
  // ASSET ERROR
  // ---------------------------------------------------------------------------

  if (assets.isError) {
    return (
      <ErrorState
        onRetry={() =>
          void assets.refetch()
        }
      />
    );
  }


  // ---------------------------------------------------------------------------
  // PAGE UI
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-5">

      {/* --------------------------------------------------------------------- */}
      {/* HEADER                                                                */}
      {/* --------------------------------------------------------------------- */}

      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Report an issue
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Geo-tagged reports are analysed automatically and escalated by risk.
        </p>
      </div>


      {/* --------------------------------------------------------------------- */}
      {/* FORM                                                                  */}
      {/* --------------------------------------------------------------------- */}

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
            onSubmit={(event) =>
              void handleSubmit(
                event,
              )
            }
          >

            {/* --------------------------------------------------------------- */}
            {/* ASSET                                                            */}
            {/* --------------------------------------------------------------- */}

            <div className="space-y-1.5">

              <Label htmlFor="asset">
                Affected asset
              </Label>

              <Select
                value={assetId}
                onValueChange={
                  setAssetId
                }
                disabled={
                  submitting ||
                  uploading
                }
              >

                <SelectTrigger
                  id="asset"
                >
                  <SelectValue placeholder="Select road, bridge or flyover" />
                </SelectTrigger>

                <SelectContent>

                  {(assets.data ??
                    []
                  ).map((item) => (

                    <SelectItem
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >
                      {item.name} ·{" "}
                      {
                        item.assetCode
                      }
                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

            </div>


            {/* --------------------------------------------------------------- */}
            {/* ISSUE TYPE                                                       */}
            {/* --------------------------------------------------------------- */}

            <div className="space-y-1.5">

              <Label htmlFor="issue">
                Issue type
              </Label>

              <Select
                value={issueType}
                onValueChange={(
                  value,
                ) =>
                  setIssueType(
                    value as IssueType,
                  )
                }
                disabled={
                  submitting ||
                  uploading
                }
              >

                <SelectTrigger
                  id="issue"
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>

                  {ISSUE_TYPES.map(
                    (type) => (

                      <SelectItem
                        key={type}
                        value={type}
                      >
                        {type}
                      </SelectItem>

                    ),
                  )}

                </SelectContent>

              </Select>

            </div>


            {/* --------------------------------------------------------------- */}
            {/* DESCRIPTION                                                      */}
            {/* --------------------------------------------------------------- */}

            <div className="space-y-1.5">

              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                rows={4}
                value={
                  description
                }
                onChange={(
                  event,
                ) =>
                  setDescription(
                    event.target
                      .value,
                  )
                }
                disabled={
                  submitting
                }
                placeholder="Describe what you observed, e.g. deep pothole in the left lane causing vehicles to swerve."
              />

            </div>


            {/* --------------------------------------------------------------- */}
            {/* IMAGE                                                            */}
            {/* --------------------------------------------------------------- */}

            <div className="space-y-2">

              <Label htmlFor="photo">
                Road image
              </Label>

              <Input
                id="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  void handleFileChange(
                    event,
                  )
                }
                disabled={
                  uploading ||
                  submitting
                }
              />

              {selectedFile && (
                <p className="text-xs text-muted-foreground">
                  Selected:{" "}
                  {
                    selectedFile.name
                  }
                </p>
              )}

              {uploading && (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">

                  <Loader2 className="size-3 animate-spin" />

                  Uploading image...

                </p>
              )}

              {imageUrl &&
                !uploading && (
                  <p className="text-xs text-green-600">
                    ✓ Image uploaded and ready for AI analysis
                  </p>
                )}

            </div>


            {/* --------------------------------------------------------------- */}
            {/* LOCATION                                                         */}
            {/* --------------------------------------------------------------- */}

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
                  ? `${coords.lat.toFixed(
                      5,
                    )}, ${coords.lng.toFixed(
                      5,
                    )}`
                  : "No location attached yet — the asset location will be used."}

              </p>


              <div className="flex flex-wrap gap-2">

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={
                    useDeviceLocation
                  }
                  disabled={
                    submitting ||
                    uploading
                  }
                >
                  Use my location
                </Button>


                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={
                    useAssetLocation
                  }
                  disabled={
                    submitting ||
                    uploading
                  }
                >
                  Use asset location
                </Button>

              </div>

            </div>


            {/* --------------------------------------------------------------- */}
            {/* SUBMIT BUTTON                                                    */}
            {/* --------------------------------------------------------------- */}

            <Button
              type="submit"
              className="w-full"
              disabled={
                submitting ||
                uploading ||
                !asset
              }
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