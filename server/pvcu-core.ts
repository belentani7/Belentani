import { createHash } from "node:crypto";

export type PvcRiskClass = "low" | "medium" | "high" | "critical";
export type PvcArtifactType = "request" | "event" | "response" | "action" | "model";
export type PvcDecision = "approved" | "rejected" | "quarantine" | "degraded" | "human_review";

export type PvcProfileDefinition = {
  allowedTools?: string[];
  maxAutonomy?: number;
  requireHumanReviewFor?: PvcRiskClass[];
  allowExternalEffects?: boolean;
  allowPii?: boolean;
  requireGrounding?: boolean;
};

export type PvcValidationInput = {
  tenantKey: string;
  operationId: string;
  profileId: string;
  artifactType: PvcArtifactType;
  riskClass: PvcRiskClass;
  payload: unknown;
  toolName?: string;
  autonomyLevel?: number;
  hasGrounding?: boolean;
  externalEffect?: boolean;
};

export type PvcValidationResult = {
  validationId: string;
  status: PvcDecision;
  riskClass: PvcRiskClass;
  spheresPassed: string[];
  failedSphere?: string;
  failureReason?: string;
  evidenceHash: string;
  metadata: Record<string, unknown>;
};

const rank: Record<PvcRiskClass, number> = { low: 1, medium: 2, high: 3, critical: 4 };

export function defaultPvcProfile(): PvcProfileDefinition {
  return {
    allowedTools: [],
    maxAutonomy: 2,
    requireHumanReviewFor: ["high", "critical"],
    allowExternalEffects: false,
    allowPii: false,
    requireGrounding: true,
  };
}

function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonical(record[key])}`).join(",")}}`;
}

export function evidenceHash(input: unknown): string {
  return createHash("sha256").update(canonical(input)).digest("hex");
}

function containsPii(value: unknown): boolean {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text) || /\b\d{8}[A-Z]\b/i.test(text);
}

export function validatePvc(input: PvcValidationInput, profile: PvcProfileDefinition = defaultPvcProfile()): PvcValidationResult {
  const validationId = `pv_${input.operationId}`;
  const spheresPassed: string[] = [];
  let failedSphere: string | undefined;
  let failureReason: string | undefined;
  let status: PvcDecision = "approved";

  const fail = (sphere: string, reason: string, decision: PvcDecision = "rejected") => {
    if (!failedSphere) {
      failedSphere = sphere;
      failureReason = reason;
      status = decision;
    }
  };

  if (input.tenantKey && input.operationId && input.profileId && input.artifactType) spheresPassed.push("L0-shape");
  else fail("L0-shape", "Missing tenant, operation, profile or artifact type");

  if (input.payload !== undefined) spheresPassed.push("L1-input");
  else fail("L1-input", "Payload is undefined");

  if (!failedSphere && (!containsPii(input.payload) || profile.allowPii)) spheresPassed.push("L2-privacy");
  else if (!failedSphere) fail("L2-privacy", "PII detected and profile does not allow it", "quarantine");

  if (!failedSphere && input.riskClass in rank) spheresPassed.push("L3-risk");
  else if (!failedSphere) fail("L3-risk", "Unknown risk class");

  if (!failedSphere && input.toolName && profile.allowedTools?.length && !profile.allowedTools.includes(input.toolName)) {
    fail("L4-tools", `Tool not allowlisted: ${input.toolName}`);
  } else if (!failedSphere) spheresPassed.push("L4-tools");

  if (!failedSphere && (input.autonomyLevel ?? 0) <= (profile.maxAutonomy ?? 0)) spheresPassed.push("L5-autonomy");
  else if (!failedSphere) fail("L5-autonomy", "Autonomy level exceeds profile limit", "human_review");

  if (!failedSphere && input.externalEffect && !profile.allowExternalEffects) {
    fail("L6-effects", "External effect requires explicit profile permission", "human_review");
  } else if (!failedSphere) spheresPassed.push("L6-effects");

  if (!failedSphere && profile.requireGrounding && input.artifactType === "action" && !input.hasGrounding) {
    fail("L7-grounding", "Action lacks grounding evidence", "quarantine");
  } else if (!failedSphere) spheresPassed.push("L7-grounding");

  if (!failedSphere && (profile.requireHumanReviewFor ?? []).some((risk) => rank[risk] <= rank[input.riskClass])) {
    status = "human_review";
  }
  if (!failedSphere) spheresPassed.push("L8-governance");

  const metadata = {
    operationId: input.operationId,
    profileId: input.profileId,
    artifactType: input.artifactType,
    riskClass: input.riskClass,
    autonomyLevel: input.autonomyLevel ?? 0,
    externalEffect: Boolean(input.externalEffect),
    payloadDigestOnly: true,
  };
  return {
    validationId,
    status,
    riskClass: input.riskClass,
    spheresPassed,
    failedSphere,
    failureReason,
    evidenceHash: evidenceHash({ input: { ...input, payload: evidenceHash(input.payload) }, metadata, status }),
    metadata,
  };
}
