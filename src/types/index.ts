export type AssetType = "Road" | "Bridge" | "Flyover" | "Tunnel" | "Culvert";

export type RiskLevel = "healthy" | "moderate" | "high" | "critical";

export type AssetStatus =
  | "Operational"
  | "Under Observation"
  | "Repair Active"
  | "Awaiting Verification"
  | "Exception Review";

export interface Asset {
  id: string;
  assetCode: string;
  type: AssetType;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  district: string;
  constructionYear: number;
  lengthKm: number;
  contractorId: string;
  projectCost: string;
  healthScore: number;
  riskScore: number;
  status: AssetStatus;
  lastInspection: string;
}

export type ComplaintStatus =
  | "Reported"
  | "AI Analysed"
  | "Risk Assigned"
  | "Work Order Created"
  | "Resolved"
  | "Rejected";

export type IssueType =
  | "Pothole"
  | "Crack"
  | "Waterlogging"
  | "Damaged barrier"
  | "Road surface damage"
  | "Other";

export interface Complaint {
  id: string;
  assetId: string;
  citizenId: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  issueType: IssueType;
  description: string;
  aiStatus: "Pending" | "Analysing" | "Completed";
  riskScore: number | null;
  status: ComplaintStatus;
  submittedBy: string;
  createdAt: string;
  workOrderId?: string;
}

export interface AiDetection {
  id: string;
  assetId: string;
  imageUrl?: string;
  detectionType: string;
  confidence: number;
  severity: RiskLevel;
  createdAt: string;
}

export interface RiskScore {
  assetId: string;
  score: number;
  level: RiskLevel;
  factors: { label: string; value: string }[];
  calculatedAt: string;
}

export type WorkOrderStatus =
  | "Pending"
  | "Assigned"
  | "In Progress"
  | "Verification"
  | "Completed"
  | "Exception Review";

export type Priority = "Critical" | "High" | "Normal";

export interface WorkOrder {
  id: string;
  assetId: string;
  complaintId?: string;
  contractorId: string;
  issue: string;
  requiredAction: string;
  priority: Priority;
  status: WorkOrderStatus;
  riskScore: number;
  createdAt: string;
  deadline: string;
  beforeImage?: string;
  afterImage?: string;
  notes?: string;
  verificationStatus: "Not started" | "Analysing" | "Verified" | "Rejected";
  verificationConfidence?: number;
}

export interface Contractor {
  id: string;
  name: string;
  licenseStatus: "ACTIVE" | "SUSPENDED" | "UNDER REVIEW";
  district: string;
  activeOrders: number;
  completedOrders: number;
  averageCompletionDays: number;
  performanceScore: number;
  verificationRate: number;
  repeatDamageRate: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  assetId: string;
  actorType: "AUTOMATED SYSTEM" | "SYSTEM" | "CITIZEN" | "CONTRACTOR" | "OFFICER";
  actorId: string;
  eventType: string;
  description: string;
  systemDecision: string;
  metadata?: {
    inputs?: { label: string; value: string }[];
    outputs?: { label: string; value: string }[];
    policy?: string;
    action?: string;
  };
}

export interface SatelliteObservation {
  year: string;
  label: string;
  note: string;
}

export interface SatelliteRecord {
  assetId: string;
  developmentStatus: string;
  changeDetection: "Low" | "Moderate" | "High";
  environmentalRisk: "Low" | "Moderate" | "High";
  lastObservation: string;
  timeline: SatelliteObservation[];
}

export interface Alert {
  id: string;
  assetId: string;
  level: RiskLevel;
  riskScore: number;
  issue: string;
  aiConfidence: number;
  recommendedAction: string;
  createdAt: string;
  resolved: boolean;
  workOrderId?: string;
}

export interface MaintenanceEntry {
  assetId: string;
  date: string;
  type: string;
  detail: string;
}

export type UserRole = "admin" | "citizen" | "contractor";

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  organisation: string;
}
