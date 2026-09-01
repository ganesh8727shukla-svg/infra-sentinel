import type { Complaint, IssueType } from "@/types";
import { createComplaint, runAutomatedPipeline, store } from "@/data/store";
import { isMock, mockResponse, request } from "./client";

export async function listComplaints(): Promise<Complaint[]> {
  if (isMock()) return mockResponse(store.getState().complaints);
  return request<Complaint[]>("/complaints");
}

export async function getComplaint(id: string): Promise<Complaint> {
  if (isMock()) {
    const c = store.getState().complaints.find((x) => x.id === id);
    if (!c) throw new Error("Complaint not found");
    return mockResponse(c);
  }

  return request<Complaint>(`/complaints/${id}`);
}

export async function submitComplaint(payload: {
  assetId: string;
  issueType: IssueType;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl?: string | undefined;
}): Promise<Complaint> {
  if (isMock()) return mockResponse(createComplaint(payload), 700);

  return request<Complaint>("/complaints", {
    method: "POST",
    json: payload,
  });
}

/**
 * Upload an image to the backend.
 */
export async function uploadImage(file: File): Promise<{
  id: string;
  url: string;
  mime: string;
  size: number;
}> {
  const token = localStorage.getItem("infrasetu.token");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "http://127.0.0.1:8001/api/uploads",
    {
      method: "POST",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Image upload failed.");
  }

  return response.json();
}

/** Mock-mode helper that advances the automated pipeline for a report. */
export async function runPipeline(complaintId: string) {
  if (isMock()) {
    runAutomatedPipeline(complaintId);
    return mockResponse(true, 200);
  }

  return true;
}