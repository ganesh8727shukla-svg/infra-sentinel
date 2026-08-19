import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as assetsApi from "@/api/assets";
import * as complaintsApi from "@/api/complaints";
import * as workOrdersApi from "@/api/workOrders";
import * as contractorsApi from "@/api/contractors";
import * as aiApi from "@/api/ai";
import * as satelliteApi from "@/api/satellite";
import * as analyticsApi from "@/api/analytics";
import * as auditApi from "@/api/audit";
import { store } from "@/data/store";

/** Keeps react-query in sync with mock-mode store mutations. */
export function useMockStoreSync() {
  const qc = useQueryClient();
  useEffect(() => {
    const unsubscribe = store.subscribe(() => void qc.invalidateQueries());
    return () => {
      unsubscribe();
    };
  }, [qc]);
}

export const useAssets = () =>
  useQuery({ queryKey: ["assets"], queryFn: assetsApi.listAssets });

export const useAsset = (id: string) =>
  useQuery({ queryKey: ["asset", id], queryFn: () => assetsApi.getAsset(id) });

export const useMaintenance = (id: string) =>
  useQuery({ queryKey: ["maintenance", id], queryFn: () => assetsApi.getMaintenanceHistory(id) });

export const useComplaints = () =>
  useQuery({ queryKey: ["complaints"], queryFn: complaintsApi.listComplaints });

export const useComplaint = (id: string) =>
  useQuery({ queryKey: ["complaint", id], queryFn: () => complaintsApi.getComplaint(id) });

export const useWorkOrders = () =>
  useQuery({ queryKey: ["work-orders"], queryFn: workOrdersApi.listWorkOrders });

export const useWorkOrder = (id: string) =>
  useQuery({ queryKey: ["work-order", id], queryFn: () => workOrdersApi.getWorkOrder(id) });

export const useContractors = () =>
  useQuery({ queryKey: ["contractors"], queryFn: contractorsApi.listContractors });

export const useContractor = (id: string) =>
  useQuery({ queryKey: ["contractor", id], queryFn: () => contractorsApi.getContractor(id) });

export const useDetections = (assetId: string) =>
  useQuery({ queryKey: ["detections", assetId], queryFn: () => aiApi.getDetections(assetId) });

export const useRisk = (assetId: string) =>
  useQuery({ queryKey: ["risk", assetId], queryFn: () => aiApi.getRisk(assetId) });

export const useAlerts = () =>
  useQuery({ queryKey: ["alerts"], queryFn: aiApi.getCriticalAlerts });

export const useSatellite = (assetId: string) =>
  useQuery({ queryKey: ["satellite", assetId], queryFn: () => satelliteApi.getSatelliteRecord(assetId) });

export const useOverview = () =>
  useQuery({ queryKey: ["overview"], queryFn: analyticsApi.getOverview });

export const useHealthAnalytics = () =>
  useQuery({ queryKey: ["analytics", "health"], queryFn: analyticsApi.getHealthAnalytics });

export const useRiskAnalytics = () =>
  useQuery({ queryKey: ["analytics", "risk"], queryFn: analyticsApi.getRiskAnalytics });

export const useWorkOrderAnalytics = () =>
  useQuery({ queryKey: ["analytics", "work-orders"], queryFn: analyticsApi.getWorkOrderAnalytics });

export const useAuditLogs = () =>
  useQuery({ queryKey: ["audit"], queryFn: auditApi.listAuditLogs });

export const useAuditLog = (id: string) =>
  useQuery({ queryKey: ["audit", id], queryFn: () => auditApi.getAuditLog(id) });
