import { describe, expect, it } from "vitest";
import { evidenceHash, validatePvc } from "./pvcu-core";

describe("PVC-U core", () => {
  it("approves a low-risk read without an external effect", () => {
    const result = validatePvc({
      tenantKey: "tenant-a",
      operationId: "op-1",
      profileId: "default",
      artifactType: "request",
      riskClass: "low",
      payload: { intent: "inspect" },
      autonomyLevel: 1,
      hasGrounding: true,
    }, {
      allowedTools: [],
      maxAutonomy: 2,
      requireHumanReviewFor: ["high", "critical"],
      allowExternalEffects: false,
      allowPii: false,
      requireGrounding: true,
    });
    expect(result.status).toBe("approved");
    expect(result.spheresPassed).toContain("L8-governance");
    expect(result.evidenceHash).toHaveLength(64);
  });

  it("routes an external high-risk action to human review", () => {
    const result = validatePvc({
      tenantKey: "tenant-a",
      operationId: "op-2",
      profileId: "default",
      artifactType: "action",
      riskClass: "high",
      payload: { intent: "send" },
      autonomyLevel: 1,
      hasGrounding: true,
      externalEffect: true,
    }, {
      allowedTools: [],
      maxAutonomy: 2,
      requireHumanReviewFor: ["high", "critical"],
      allowExternalEffects: false,
      allowPii: false,
      requireGrounding: true,
    });
    expect(result.status).toBe("human_review");
    expect(result.failedSphere).toBe("L6-effects");
  });

  it("produces a stable digest for equivalent objects", () => {
    expect(evidenceHash({ b: 2, a: 1 })).toBe(evidenceHash({ a: 1, b: 2 }));
  });
});
