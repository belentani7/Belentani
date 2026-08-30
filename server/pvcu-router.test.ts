import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import {
  canAccessPvcTenant,
  createPvcEvidence,
  createPvcValidation,
  getPvcTenant,
  listPvcEvidence,
  listPvcProfiles,
} from "./pvcu-db";

vi.mock("./pvcu-db", async () => {
  const actual = await vi.importActual<typeof import("./pvcu-db")>("./pvcu-db");
  return {
    ...actual,
    getPvcTenant: vi.fn(),
    listPvcProfiles: vi.fn(),
    createPvcValidation: vi.fn(),
    createPvcEvidence: vi.fn(),
    listPvcEvidence: vi.fn(),
  };
});

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(openId: string, role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: role === "admin" ? 2 : 1,
    openId,
    email: `${openId}@example.com`,
    name: openId,
    loginMethod: "test",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("PVC-U tenant isolation", () => {
  it("enforces owner matching unless the caller is an administrator", () => {
    expect(canAccessPvcTenant("owner-a", "owner-a", false)).toBe(true);
    expect(canAccessPvcTenant("owner-a", "owner-b", false)).toBe(false);
    expect(canAccessPvcTenant("owner-a", "owner-b", true)).toBe(true);
  });

  it("rejects a user trying to read a tenant outside their owner scope", async () => {
    vi.mocked(getPvcTenant).mockResolvedValueOnce(undefined);
    const caller = appRouter.createCaller(createContext("owner-b"));

    await expect(caller.pvcu.profiles({ tenantKey: "tenant-a" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows a user to read profiles only after tenant scope is confirmed", async () => {
    vi.mocked(getPvcTenant).mockResolvedValueOnce({
      id: 1,
      tenantKey: "tenant-a",
      ownerOpenId: "owner-a",
      name: "Tenant A",
      tier: "business",
      status: "active",
      config: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(listPvcProfiles).mockResolvedValueOnce([]);
    const caller = appRouter.createCaller(createContext("owner-a"));

    await expect(caller.pvcu.profiles({ tenantKey: "tenant-a" })).resolves.toEqual([]);
    expect(getPvcTenant).toHaveBeenCalledWith("tenant-a", "owner-a", false);
    expect(listPvcProfiles).toHaveBeenCalledWith("tenant-a");
  });

  it("allows admin scope while preserving the requested tenant key", async () => {
    vi.mocked(getPvcTenant).mockResolvedValueOnce({
      id: 1,
      tenantKey: "tenant-a",
      ownerOpenId: "owner-a",
      name: "Tenant A",
      tier: "business",
      status: "active",
      config: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(listPvcEvidence).mockResolvedValueOnce([]);
    const caller = appRouter.createCaller(createContext("admin", "admin"));

    await expect(caller.pvcu.evidence({ tenantKey: "tenant-a" })).resolves.toEqual([]);
    expect(getPvcTenant).toHaveBeenCalledWith("tenant-a", "admin", true);
    expect(listPvcEvidence).toHaveBeenCalledWith("tenant-a", undefined);
  });
});

describe("PVC-U evidence persistence", () => {
  it("persists an evidence record for a successful validation", async () => {
    vi.mocked(getPvcTenant).mockResolvedValueOnce({
      id: 1,
      tenantKey: "tenant-a",
      ownerOpenId: "owner-a",
      name: "Tenant A",
      tier: "business",
      status: "active",
      config: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(listPvcProfiles).mockResolvedValueOnce([]);
    vi.mocked(createPvcValidation).mockResolvedValueOnce({
      id: 1,
      validationId: "val-1",
      tenantKey: "tenant-a",
      profileId: "universal",
      artifactType: "request",
      riskClass: "low",
      status: "approved",
      spheresPassed: null,
      failedSphere: null,
      failureReason: null,
      evidenceHash: "a".repeat(64),
      metadata: null,
      createdAt: new Date(),
    });
    vi.mocked(createPvcEvidence).mockResolvedValueOnce({
      id: 1,
      evidenceId: "evi-1",
      validationId: "val-1",
      tenantKey: "tenant-a",
      evidenceHash: "a".repeat(64),
      algorithm: "sha256",
      provenance: null,
      retentionUntil: null,
      createdAt: new Date(),
    });

    const caller = appRouter.createCaller(createContext("owner-a"));
    const result = await caller.pvcu.validate({
      tenantKey: "tenant-a",
      operationId: "op-1",
      profileId: "universal",
      artifactType: "request",
      riskClass: "low",
      payload: { ok: true },
    });

    expect(result.validationId).toBe("val-1");
    expect(createPvcValidation).toHaveBeenCalledOnce();
    expect(createPvcEvidence).toHaveBeenCalledOnce();
    expect(vi.mocked(createPvcEvidence).mock.calls[0]?.[0]).toMatchObject({
      tenantKey: "tenant-a",
      validationId: expect.any(String),
      algorithm: "sha256",
    });
  });
});
