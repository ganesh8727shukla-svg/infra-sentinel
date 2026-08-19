import type { Asset, MaintenanceEntry } from "@/types";
import { maintenance } from "@/data/mock";
import { addAsset, store } from "@/data/store";
import { isMock, mockResponse, request } from "./client";

export async function listAssets(): Promise<Asset[]> {
  if (isMock()) return mockResponse(store.getState().assets);
  return request<Asset[]>("/assets");
}

export async function getAsset(id: string): Promise<Asset> {
  if (isMock()) {
    const asset = store.getState().assets.find((a) => a.id === id);
    if (!asset) throw new Error("Asset not found");
    return mockResponse(asset);
  }
  return request<Asset>(`/assets/${id}`);
}

export async function createAsset(payload: Partial<Asset> & { assetCode: string }): Promise<Asset> {
  if (isMock()) return mockResponse(addAsset(payload), 500);
  return request<Asset>("/assets", { method: "POST", json: payload });
}

export async function updateAsset(id: string, payload: Partial<Asset>): Promise<Asset> {
  if (isMock()) return getAsset(id);
  return request<Asset>(`/assets/${id}`, { method: "PUT", json: payload });
}

export async function getMaintenanceHistory(assetId: string): Promise<MaintenanceEntry[]> {
  if (isMock())
    return mockResponse(maintenance.filter((m) => m.assetId === assetId));
  return request<MaintenanceEntry[]>(`/assets/${assetId}/maintenance`);
}
