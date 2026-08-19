import type { WorkOrder } from "@/types";
import { completeVerification, startWork, store, submitRepairEvidence } from "@/data/store";
import { isMock, mockResponse, request } from "./client";

export async function listWorkOrders(): Promise<WorkOrder[]> {
  if (isMock()) return mockResponse(store.getState().workOrders);
  return request<WorkOrder[]>("/work-orders");
}

export async function getWorkOrder(id: string): Promise<WorkOrder> {
  if (isMock()) {
    const wo = store.getState().workOrders.find((w) => w.id === id);
    if (!wo) throw new Error("Work order not found");
    return mockResponse(wo);
  }
  return request<WorkOrder>(`/work-orders/${id}`);
}

export async function createWorkOrder(payload: Partial<WorkOrder>): Promise<WorkOrder | null> {
  if (isMock()) return mockResponse(null, 400);
  return request<WorkOrder>("/work-orders", { method: "POST", json: payload });
}

export async function beginWork(id: string) {
  if (isMock()) {
    startWork(id);
    return mockResponse(true, 400);
  }
  return request<WorkOrder>(`/work-orders/${id}`, { method: "PUT", json: { status: "In Progress" } });
}

export async function submitEvidence(
  id: string,
  payload: { beforeImage?: string | undefined; afterImage?: string | undefined; notes?: string | undefined },
) {
  if (isMock()) {
    submitRepairEvidence(id, payload);
    return mockResponse(true, 500);
  }
  return request<WorkOrder>(`/work-orders/${id}`, { method: "PUT", json: payload });
}

export async function finaliseVerification(id: string, confidence = 93) {
  if (isMock()) {
    completeVerification(id, confidence);
    return mockResponse(true, 300);
  }
  return request<WorkOrder>(`/work-orders/${id}`, {
    method: "PUT",
    json: { verificationStatus: "Verified" },
  });
}
