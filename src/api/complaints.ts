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
  return request<Complaint>("/complaints", { method: "POST", json: payload });
}

/** Mock-mode helper that advances the automated pipeline for a report. */
export async function runPipeline(complaintId: string) {
  if (isMock()) {
    runAutomatedPipeline(complaintId);
    return mockResponse(true, 200);
  }
  return true;
}
