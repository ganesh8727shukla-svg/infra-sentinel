import type { AuditLog } from "@/types";
import { store } from "@/data/store";
import { isMock, mockResponse, request } from "./client";

export async function listAuditLogs(): Promise<AuditLog[]> {
  if (isMock()) return mockResponse(store.getState().auditLogs);
  return request<AuditLog[]>("/audit");
}

export async function getAuditLog(id: string): Promise<AuditLog> {
  if (isMock()) {
    const log = store.getState().auditLogs.find((l) => l.id === id);
    if (!log) throw new Error("Audit event not found");
    return mockResponse(log);
  }
  return request<AuditLog>(`/audit/${id}`);
}
