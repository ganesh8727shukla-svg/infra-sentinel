import type { AiDetection, Alert, RiskScore } from "@/types";
import { store } from "@/data/store";
import { riskLevel } from "@/utils/format";
import { isMock, mockResponse, request } from "./client";

export async function analyzeImage(payload: { assetId: string; imageUrl?: string }) {
  if (isMock())
    return mockResponse(
      { detectionType: "Pothole", confidence: 94, severity: "critical" as const },
      1200,
    );
  return request<{ detectionType: string; confidence: number; severity: string }>("/ai/analyze", {
    method: "POST",
    json: payload,
  });
}

export async function getDetections(assetId: string): Promise<AiDetection[]> {
  if (isMock())
    return mockResponse(store.getState().detections.filter((d) => d.assetId === assetId));
  return request<AiDetection[]>(`/ai/detections/${assetId}`);
}

export async function getRisk(assetId: string): Promise<RiskScore> {
  if (isMock()) {
    const asset = store.getState().assets.find((a) => a.id === assetId);
    const score = asset?.riskScore ?? 0;
    return mockResponse({
      assetId,
      score,
      level: riskLevel(score),
      factors: [
        { label: "AI severity", value: "91" },
        { label: "Traffic exposure", value: "High" },
        { label: "Asset age", value: `${asset ? 2026 - asset.constructionYear : 0} years` },
        { label: "Complaint volume", value: "14" },
      ],
      calculatedAt: new Date().toISOString(),
    });
  }
  return request<RiskScore>(`/risk/${assetId}`);
}

export async function getCriticalAlerts(): Promise<Alert[]> {
  if (isMock()) return mockResponse(store.getState().alerts);
  return request<Alert[]>("/risk/critical");
}
