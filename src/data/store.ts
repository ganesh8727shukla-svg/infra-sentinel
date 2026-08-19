import type {
  Alert,
  AiDetection,
  Asset,
  AuditLog,
  Complaint,
  Contractor,
  IssueType,
  WorkOrder,
} from "@/types";
import * as mock from "./mock";

interface State {
  assets: Asset[];
  complaints: Complaint[];
  workOrders: WorkOrder[];
  contractors: Contractor[];
  detections: AiDetection[];
  alerts: Alert[];
  auditLogs: AuditLog[];
}

let state: State = {
  assets: mock.assets.map((a) => ({ ...a })),
  complaints: mock.complaints.map((c) => ({ ...c })),
  workOrders: mock.workOrders.map((w) => ({ ...w })),
  contractors: mock.contractors.map((c) => ({ ...c })),
  detections: mock.detections.map((d) => ({ ...d })),
  alerts: mock.alerts.map((a) => ({ ...a })),
  auditLogs: mock.auditLogs.map((a) => ({ ...a })),
};

const listeners = new Set<() => void>();

function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}

export const store = {
  getState: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

let seq = 300;
const nextId = () => String(++seq);

function audit(entry: Omit<AuditLog, "id" | "timestamp">) {
  state.auditLogs = [
    { id: `A${10240 + Number(nextId())}`, timestamp: new Date().toISOString(), ...entry },
    ...state.auditLogs,
  ];
}

export function createComplaint(input: {
  assetId: string;
  issueType: IssueType;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl?: string | undefined;
}): Complaint {
  const id = `CIT-${10290 + state.complaints.length + 1}`;
  const complaint: Complaint = {
    id,
    assetId: input.assetId,
    citizenId: "USR-0001",
    imageUrl: input.imageUrl,
    latitude: input.latitude,
    longitude: input.longitude,
    issueType: input.issueType,
    description: input.description,
    aiStatus: "Analysing",
    riskScore: null,
    status: "Reported",
    submittedBy: "You",
    createdAt: new Date().toISOString(),
  };
  state.complaints = [complaint, ...state.complaints];
  audit({
    assetId: input.assetId,
    actorType: "CITIZEN",
    actorId: "USR-0001",
    eventType: "Citizen Report Received",
    description: `Citizen report ${id} received with evidence.`,
    systemDecision: id,
    metadata: {
      inputs: [{ label: "Issue type", value: input.issueType }],
      policy: "INTAKE_V1",
      action: "Queued for AI analysis",
    },
  });
  emit();
  return complaint;
}

/** Runs the automated pipeline: AI detection -> risk -> work order -> assignment. */
export function runAutomatedPipeline(complaintId: string) {
  const complaint = state.complaints.find((c) => c.id === complaintId);
  if (!complaint) return;
  const asset = state.assets.find((a) => a.id === complaint.assetId);
  const confidence = 94;
  const risk = 87;

  state.detections = [
    {
      id: `AID-${5100 + state.detections.length}`,
      assetId: complaint.assetId,
      detectionType: complaint.issueType,
      confidence,
      severity: "critical",
      createdAt: new Date().toISOString(),
    },
    ...state.detections,
  ];
  audit({
    assetId: complaint.assetId,
    actorType: "AUTOMATED SYSTEM",
    actorId: "vision-engine",
    eventType: "AI Analysed",
    description: "Computer vision detection completed on submitted evidence.",
    systemDecision: `${complaint.issueType} • ${confidence}% confidence`,
    metadata: { policy: "VISION_DETECT_V4", action: "Forwarded to risk engine" },
  });

  audit({
    assetId: complaint.assetId,
    actorType: "AUTOMATED SYSTEM",
    actorId: "risk-engine",
    eventType: "Risk Calculated",
    description: "Rule-based risk assessment executed.",
    systemDecision: `Risk = ${risk}`,
    metadata: {
      inputs: [
        { label: "AI severity", value: "91" },
        { label: "Traffic", value: "High" },
        { label: "Asset age", value: `${asset ? 2026 - asset.constructionYear : 3} years` },
      ],
      outputs: [
        { label: "Risk", value: String(risk) },
        { label: "Level", value: "CRITICAL" },
      ],
      policy: "CRITICAL_RISK_V2",
      action: "Urgent Work Order Created",
    },
  });

  const woId = `WO-${1030 + state.workOrders.length}`;
  const contractor =
    state.contractors.find((c) => c.district === asset?.district && c.licenseStatus === "ACTIVE") ??
    state.contractors[0]!;
  const wo: WorkOrder = {
    id: woId,
    assetId: complaint.assetId,
    complaintId: complaint.id,
    contractorId: contractor.id,
    issue: complaint.issueType,
    requiredAction: "Road surface repair",
    priority: "Critical",
    status: "Assigned",
    riskScore: risk,
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
    verificationStatus: "Not started",
  };
  state.workOrders = [wo, ...state.workOrders];
  audit({
    assetId: complaint.assetId,
    actorType: "AUTOMATED SYSTEM",
    actorId: "workflow-engine",
    eventType: "Work Order Created",
    description: "System-generated work order for urgent maintenance.",
    systemDecision: woId,
    metadata: { policy: "AUTO_WORKORDER_V3", action: "Contractor assignment triggered" },
  });
  audit({
    assetId: complaint.assetId,
    actorType: "SYSTEM",
    actorId: "assignment-engine",
    eventType: "Contractor Assigned",
    description: "Contractor selected by performance and jurisdiction rules.",
    systemDecision: contractor.name,
    metadata: { policy: "ASSIGNMENT_RULE_V2", action: "Work order dispatched" },
  });

  state.complaints = state.complaints.map((c) =>
    c.id === complaintId
      ? { ...c, aiStatus: "Completed", riskScore: risk, status: "Work Order Created", workOrderId: woId }
      : c,
  );
  state.alerts = [
    {
      id: `ALR-${9100 + state.alerts.length}`,
      assetId: complaint.assetId,
      level: "critical",
      riskScore: risk,
      issue: `${complaint.issueType} detected`,
      aiConfidence: confidence,
      recommendedAction: "Urgent maintenance",
      createdAt: new Date().toISOString(),
      resolved: false,
      workOrderId: woId,
    },
    ...state.alerts,
  ];
  state.assets = state.assets.map((a) =>
    a.id === complaint.assetId
      ? { ...a, riskScore: risk, healthScore: Math.min(a.healthScore, 42), status: "Repair Active" }
      : a,
  );
  emit();
  return wo;
}

export function startWork(workOrderId: string) {
  state.workOrders = state.workOrders.map((w) =>
    w.id === workOrderId ? { ...w, status: "In Progress" } : w,
  );
  const wo = state.workOrders.find((w) => w.id === workOrderId);
  if (wo) {
    audit({
      assetId: wo.assetId,
      actorType: "CONTRACTOR",
      actorId: wo.contractorId,
      eventType: "Repair Started",
      description: "Contractor marked repair as started on site.",
      systemDecision: workOrderId,
      metadata: { policy: "FIELD_EXECUTION_V1", action: "Awaiting repair evidence" },
    });
  }
  emit();
}

export function submitRepairEvidence(
  workOrderId: string,
  payload: { beforeImage?: string; afterImage?: string; notes?: string },
) {
  state.workOrders = state.workOrders.map((w) =>
    w.id === workOrderId
      ? { ...w, ...payload, status: "Verification", verificationStatus: "Analysing" }
      : w,
  );
  const wo = state.workOrders.find((w) => w.id === workOrderId);
  if (wo) {
    state.assets = state.assets.map((a) =>
      a.id === wo.assetId ? { ...a, status: "Awaiting Verification" } : a,
    );
    audit({
      assetId: wo.assetId,
      actorType: "CONTRACTOR",
      actorId: wo.contractorId,
      eventType: "Repair Evidence Submitted",
      description: "Before/after evidence submitted for AI verification.",
      systemDecision: workOrderId,
      metadata: { policy: "REPAIR_VERIFY_V2", action: "Verification queued" },
    });
  }
  emit();
}

export function completeVerification(workOrderId: string, confidence = 93) {
  state.workOrders = state.workOrders.map((w) =>
    w.id === workOrderId
      ? { ...w, status: "Completed", verificationStatus: "Verified", verificationConfidence: confidence }
      : w,
  );
  const wo = state.workOrders.find((w) => w.id === workOrderId);
  if (wo) {
    state.assets = state.assets.map((a) =>
      a.id === wo.assetId
        ? {
            ...a,
            status: "Operational",
            healthScore: Math.min(96, a.healthScore + 38),
            riskScore: Math.max(12, a.riskScore - 61),
            lastInspection: new Date().toISOString(),
          }
        : a,
    );
    state.alerts = state.alerts.map((al) =>
      al.workOrderId === workOrderId ? { ...al, resolved: true } : al,
    );
    state.complaints = state.complaints.map((c) =>
      c.workOrderId === workOrderId ? { ...c, status: "Resolved" } : c,
    );
    audit({
      assetId: wo.assetId,
      actorType: "AUTOMATED SYSTEM",
      actorId: "vision-engine",
      eventType: "Repair Verified",
      description: "Before/after evidence comparison completed.",
      systemDecision: `Verified • ${confidence}%`,
      metadata: { policy: "REPAIR_VERIFY_V2", action: `Work order ${workOrderId} completed` },
    });
    audit({
      assetId: wo.assetId,
      actorType: "AUTOMATED SYSTEM",
      actorId: "passport-engine",
      eventType: "Digital Passport Updated",
      description: "Asset health, risk and lifecycle history updated.",
      systemDecision: "Passport revision committed",
      metadata: { policy: "PASSPORT_SYNC_V1", action: "Lifecycle record appended" },
    });
  }
  emit();
}

export function addAsset(asset: Partial<Asset> & { assetCode: string }) {
  const created: Asset = {
    id: asset.assetCode,
    assetCode: asset.assetCode,
    type: asset.type ?? "Road",
    name: asset.name ?? asset.assetCode,
    location: asset.location ?? "Maharashtra",
    latitude: asset.latitude ?? 19.1,
    longitude: asset.longitude ?? 73.0,
    district: asset.district ?? "Mumbai",
    constructionYear: asset.constructionYear ?? 2026,
    lengthKm: asset.lengthKm ?? 1,
    contractorId: asset.contractorId ?? "CON-01",
    projectCost: asset.projectCost ?? "₹0 Cr",
    healthScore: asset.healthScore ?? 95,
    riskScore: asset.riskScore ?? 10,
    status: "Operational",
    lastInspection: new Date().toISOString(),
  };
  state.assets = [created, ...state.assets];
  audit({
    assetId: created.id,
    actorType: "OFFICER",
    actorId: "GOV-ADMIN",
    eventType: "Asset Registered",
    description: `${created.assetCode} added to the infrastructure register.`,
    systemDecision: created.assetCode,
    metadata: { policy: "ASSET_REGISTRY_V1", action: "Digital passport created" },
  });
  emit();
  return created;
}

export function resetDemo() {
  state = {
    assets: mock.assets.map((a) => ({ ...a })),
    complaints: mock.complaints.map((c) => ({ ...c })),
    workOrders: mock.workOrders.map((w) => ({ ...w })),
    contractors: mock.contractors.map((c) => ({ ...c })),
    detections: mock.detections.map((d) => ({ ...d })),
    alerts: mock.alerts.map((a) => ({ ...a })),
    auditLogs: mock.auditLogs.map((a) => ({ ...a })),
  };
  emit();
}
