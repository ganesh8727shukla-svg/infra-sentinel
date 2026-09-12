import { isMock, mockResponse, request } from "./client";

/**
 * Analytics API types
 *
 * These interfaces describe the actual data expected from
 * the InfraSetu backend.
 */

export interface OverviewAnalytics {
  totalAssets: number;
  healthyAssets: number;
  moderateAssets: number;
  highRiskAssets: number;
  criticalAssets: number;
  openComplaints: number;
  activeWorkOrders: number;
  completedWorkOrders: number;
}

export interface HealthDistributionItem {
  key: string;
  name: string;
  value: number;
}

export interface HealthTrendItem {
  month: string;
  health: number;
}

export interface RiskDistrictItem {
  district: string;
  risk: number;
}

export interface WorkOrderTrendItem {
  month: string;
  reported: number;
  created: number;
  completed: number;
  verified: number;
}

export interface VerificationRateItem {
  month: string;
  rate: number;
}

export interface RepairTimeItem {
  month: string;
  days: number;
}

export interface ExpenditureItem {
  month: string;
  crore: number;
}

export interface HealthAnalyticsResponse {
  distribution: HealthDistributionItem[];
  trend: HealthTrendItem[];
}

export interface RiskAnalyticsResponse {
  byDistrict: RiskDistrictItem[];
}

export interface WorkOrderAnalyticsResponse {
  trend: WorkOrderTrendItem[];
  verificationRate: VerificationRateItem[];
  repairTime: RepairTimeItem[];
  expenditure: ExpenditureItem[];
}

/**
 * Mock data is intentionally kept isolated here only so that
 * existing mock mode continues to work if explicitly enabled.
 *
 * Normal production/demo mode should have VITE_USE_MOCK_DATA=false.
 */

export async function getOverview() {
  if (isMock()) {
    const { overview } = await import("@/data/mock");
    return mockResponse(overview);
  }

  return request<OverviewAnalytics>(
    "/analytics/overview",
  );
}

export async function getHealthAnalytics() {
  if (isMock()) {
    const {
      healthDistribution,
      healthTrend,
    } = await import("@/data/mock");

    return mockResponse({
      distribution: healthDistribution,
      trend: healthTrend,
    });
  }

  return request<HealthAnalyticsResponse>(
    "/analytics/health",
  );
}

export async function getRiskAnalytics() {
  if (isMock()) {
    const { riskByDistrict } = await import("@/data/mock");

    return mockResponse({
      byDistrict: riskByDistrict,
    });
  }

  return request<RiskAnalyticsResponse>(
    "/analytics/risk",
  );
}

export async function getWorkOrderAnalytics() {
  if (isMock()) {
    const {
      workOrderTrend,
      verificationRate,
      repairTime,
      expenditure,
    } = await import("@/data/mock");

    return mockResponse({
      trend: workOrderTrend,
      verificationRate,
      repairTime,
      expenditure,
    });
  }

  return request<WorkOrderAnalyticsResponse>(
    "/analytics/work-orders",
  );
}