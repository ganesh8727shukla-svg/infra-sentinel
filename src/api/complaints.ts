import type { Complaint, IssueType } from "@/types";

import {

  createComplaint,

  runAutomatedPipeline,

  store,

} from "@/data/store";

import { isMock, mockResponse, request } from "./client";

import { API_BASE_URL } from "@/config";

type UploadResponse = {

  id: string;

  url: string;

  mime: string;

  size: number;

};

async function parseError(response: Response): Promise<string> {

  try {

    const data = await response.json();

    if (typeof data?.detail === "string") {

      return data.detail;

    }

    if (Array.isArray(data?.detail)) {

      return data.detail

        .map((item: any) => item?.msg || JSON.stringify(item))

        .join(", ");

    }

    if (data?.message) {

      return data.message;

    }

  } catch {

    // Ignore non-JSON responses.

  }

  return `Request failed with status ${response.status}`;

}

export async function listComplaints(): Promise<Complaint[]> {

  if (isMock()) {

    return mockResponse(store.getState().complaints);

  }

  return request<Complaint[]>("/complaints");

}

export async function getComplaint(id: string): Promise<Complaint> {

  if (isMock()) {

    const complaint = store

      .getState()

      .complaints

      .find((item) => item.id === id);

    if (!complaint) {

      throw new Error("Complaint not found");

    }

    return mockResponse(complaint);

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

  const token = localStorage.getItem("infrasetu.token");

  if (!token) {

    throw new Error(

      "Authentication token missing. Please sign in again.",

    );

  }

  console.log("[InfraSetu] POST complaint:", {

    url: `${API_BASE_URL}/complaints`,

    hasToken: true,

    payload,

  });

  const response = await fetch(`${API_BASE_URL}/complaints`, {

    method: "POST",

    headers: {

      "Content-Type": "application/json",

      Authorization: `Bearer ${token}`,

    },

    body: JSON.stringify(payload),

  });

  if (!response.ok) {

    const message = await parseError(response);

    console.error("[InfraSetu] Complaint API failed:", {

      status: response.status,

      statusText: response.statusText,

      message,

    });

    throw new Error(message);

  }

  const complaint = (await response.json()) as Complaint;

  console.log("[InfraSetu] Complaint created:", complaint);

  return complaint;

}

/**

* * Upload an image to the backend.*

* */

export async function uploadImage(file: File): Promise<UploadResponse> {

  const token = localStorage.getItem("infrasetu.token");

  if (!token) {

    throw new Error(

      "Authentication token missing. Please sign in again.",

    );

  }

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/uploads`, {

    method: "POST",

    headers: {

      Authorization: `Bearer ${token}`,

    },

    body: formData,

  });

  if (!response.ok) {

    const message = await parseError(response);

    console.error("[InfraSetu] Image upload failed:", {

      status: response.status,

      statusText: response.statusText,

      message,

    });

    throw new Error(message);

  }

  return (await response.json()) as UploadResponse;

}

/**

* * Mock-mode helper.*

* **

* * The real backend already runs the complaint pipeline*

* * inside POST /api/complaints, so no second request is needed.*

* */

export async function runPipeline(complaintId: string) {

  if (isMock()) {

    runAutomatedPipeline(complaintId);

    return mockResponse(true, 200);

  }

  return true;

}