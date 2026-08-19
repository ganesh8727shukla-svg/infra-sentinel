import {
  expenditure,
  healthDistribution,
  healthTrend,
  overview,
  repairTime,
  riskByDistrict,
  verificationRate,
  workOrderTrend,
} from "@/data/mock";
import { isMock, mockResponse, request } from "./client";

export async function getOverview() {
  if (isMock()) return mockResponse(overview);
  return request<typeof overview>("/analytics/overview");
}

export async function getHealthAnalytics() {
  if (isMock()) return mockResponse({ distribution: healthDistribution, trend: healthTrend });
  return request<{ distribution: typeof healthDistribution; trend: typeof healthTrend }>(
    "/analytics/health",
  );
}

export async function getRiskAnalytics() {
  if (isMock()) return mockResponse({ byDistrict: riskByDistrict });
  return request<{ byDistrict: typeof riskByDistrict }>("/analytics/risk");
}

export async function getWorkOrderAnalytics() {
  if (isMock())
    return mockResponse({
      trend: workOrderTrend,
      verificationRate,
      repairTime,
      expenditure,
    });
  return request<{
    trend: typeof workOrderTrend;
    verificationRate: typeof verificationRate;
    repairTime: typeof repairTime;
    expenditure: typeof expenditure;
  }>("/analytics/work-orders");
}
