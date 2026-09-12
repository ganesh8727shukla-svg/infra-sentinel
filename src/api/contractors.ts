import type { Contractor } from "@/types";
import { store } from "@/data/store";
import { isMock, mockResponse, request } from "./client";

export async function listContractors(): Promise<Contractor[]> {
  if (isMock()) return mockResponse(store.getState().contractors);
  return request<Contractor[]>("/contractors");
}

export async function getContractor(id: string): Promise<Contractor> {
  if (isMock()) {
    const c = store.getState().contractors.find((x) => x.id === id);
    if (!c) throw new Error("Contractor not found");
    return mockResponse(c);
  }
  return request<Contractor>(`/contractors/${id}`);
}
