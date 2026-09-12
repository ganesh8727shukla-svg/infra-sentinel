import type { Complaint, IssueType } from "@/types";
import { createComplaint, runAutomatedPipeline, store } from "@/data/store";
import {
  isMock,
  mockResponse,
  request,
  getToken,
} from "./client";

export async function listComplaints(): Promise<Complaint[]> {
  if (isMock()) {
    return mockResponse(store.getState().complaints);
  }

  return request<Complaint[]>("/complaints");
}

export async function getComplaint(id: string): Promise<Complaint> {
  if (isMock()) {
    const c = store.getState().complaints.find((x) => x.id === id);

    if (!c) {
      throw new Error("Complaint not found");
    }

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
  imageUrl?: string;
}): Promise<Complaint> {
  if (isMock()) {
    return mockResponse(createComplaint(payload), 700);
  }

  return request<Complaint>("/complaints", {
    method: "POST",
    json: payload,
  });
}

export async function uploadImage(file: File): Promise<{
  id: string;
  url: string;
  mime: string;
  size: number;
}> {
  const token = getToken();

  const formData = new FormData();
  formData.append("file", file);

  const baseUrl =
    (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ??
    "/api";

  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/uploads`,
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
    let message = "Image upload failed.";

    try {
      const data = await response.json();

      if (data?.detail) {
        message = String(data.detail);
      }
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

export async function runPipeline(complaintId: string) {
  if (isMock()) {
    runAutomatedPipeline(complaintId);
    return mockResponse(true, 200);
  }

  return true;
}