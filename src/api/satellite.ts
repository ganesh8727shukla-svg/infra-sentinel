import type { SatelliteObservation, SatelliteRecord } from "@/types";
import { satellite } from "@/data/mock";
import { isMock, mockResponse, request } from "./client";

export async function getSatelliteRecord(assetId: string): Promise<SatelliteRecord> {
  if (isMock()) {
    const record = satellite.find((s) => s.assetId === assetId) ?? satellite[0]!;
    return mockResponse(record);
  }
  return request<SatelliteRecord>(`/satellite/${assetId}`);
}

export async function getSatelliteHistory(assetId: string): Promise<SatelliteObservation[]> {
  if (isMock()) {
    const record = satellite.find((s) => s.assetId === assetId) ?? satellite[0]!;
    return mockResponse(record.timeline);
  }
  return request<SatelliteObservation[]>(`/satellite/${assetId}/history`);
}
