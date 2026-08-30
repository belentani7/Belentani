import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createPvcEvidence,
  createPvcException,
  createPvcProfile,
  createPvcTenant,
  createPvcValidation,
  getPvcOverview,
  getPvcTenant,
  listPvcEvidence,
  listPvcExceptions,
  listPvcProfiles,
  listPvcTenants,
  listPvcValidations,
} from "../pvcu-db";
import { defaultPvcProfile, validatePvc } from "../pvcu-core";

const riskClass = z.enum(["low", "medium", "high", "critical"]);
const artifactType = z.enum(["request", "event", "response", "action", "model"]);
const profileDefinition = z.object({
  allowedTools: z.array(z.string()).default([]),
  maxAutonomy: z.number().int().min(0).max(5).default(2),
  requireHumanReviewFor: z.array(riskClass).default(["high", "critical"]),
  allowExternalEffects: z.boolean().default(false),
  allowPii: z.boolean().default(false),
  requireGrounding: z.boolean().default(true),
});

async function requireTenant(tenantKey: string, user: { openId: string; role: string }) {
  const tenant = await getPvcTenant(tenantKey, user.openId, user.role === "admin");
  if (!tenant) throw new TRPCError({ code: "FORBIDDEN", message: "Tenant scope is not available" });
  return tenant;
}

export const pvcuRouter = router({
  tenants: protectedProcedure.query(({ ctx }) => listPvcTenants(ctx.user.openId, ctx.user.role === "admin")),

  createTenant: protectedProcedure.input(z.object({
    tenantKey: z.string().min(3).max(64).regex(/^[a-z0-9-]+$/),
    name: z.string().min(1).max(255),
    tier: z.enum(["individual", "business", "enterprise"]).default("business"),
  })).mutation(({ ctx, input }) => createPvcTenant({
    tenantKey: input.tenantKey,
    ownerOpenId: ctx.user.openId,
    name: input.name,
    tier: input.tier,
    status: "active",
    config: { version: "pvcu.v1" },
  })),

  profiles: protectedProcedure.input(z.object({ tenantKey: z.string() })).query(({ ctx, input }) =>
    requireTenant(input.tenantKey, ctx.user).then(() => listPvcProfiles(input.tenantKey))),

  createProfile: protectedProcedure.input(z.object({
    tenantKey: z.string(),
    profileId: z.string().min(2).max(128),
    version: z.string().min(1).max(32).default("1.0.0"),
    riskClass,
    domain: z.string().min(1).max(64).default("universal"),
    definition: profileDefinition.default({ allowedTools: [], maxAutonomy: 2, requireHumanReviewFor: ["high", "critical"], allowExternalEffects: false, allowPii: false, requireGrounding: true }),
  })).mutation(async ({ ctx, input }) => {
    await requireTenant(input.tenantKey, ctx.user);
    return createPvcProfile({ ...input, status: "active" });
  }),

  validations: protectedProcedure.input(z.object({ tenantKey: z.string() })).query(({ ctx, input }) =>
    requireTenant(input.tenantKey, ctx.user).then(() => listPvcValidations(input.tenantKey))),

  evidence: protectedProcedure.input(z.object({ tenantKey: z.string(), validationId: z.string().optional() })).query(({ ctx, input }) =>
    requireTenant(input.tenantKey, ctx.user).then(() => listPvcEvidence(input.tenantKey, input.validationId))),

  exceptions: protectedProcedure.input(z.object({ tenantKey: z.string() })).query(({ ctx, input }) =>
    requireTenant(input.tenantKey, ctx.user).then(() => listPvcExceptions(input.tenantKey))),

  createException: protectedProcedure.input(z.object({
    tenantKey: z.string(),
    profileId: z.string().min(2).max(128),
    reason: z.string().min(1).max(2000),
    compensatingControls: z.string().min(1).max(4000),
    expiresAt: z.coerce.date(),
  })).mutation(async ({ ctx, input }) => {
    await requireTenant(input.tenantKey, ctx.user);
    if (input.expiresAt.getTime() <= Date.now()) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Exception must expire in the future" });
    }
    return createPvcException({
      exceptionId: `exc-${nanoid(12)}`,
      tenantKey: input.tenantKey,
      profileId: input.profileId,
      reason: input.reason,
      compensatingControls: input.compensatingControls,
      expiresAt: input.expiresAt,
      approvedBy: ctx.user.openId,
      status: "active",
    });
  }),

  overview: protectedProcedure.input(z.object({ tenantKey: z.string() })).query(({ ctx, input }) =>
    requireTenant(input.tenantKey, ctx.user).then(() => getPvcOverview(input.tenantKey))),

  validate: protectedProcedure.input(z.object({
    tenantKey: z.string(),
    operationId: z.string().min(3).max(128),
    profileId: z.string().min(2).max(128),
    artifactType,
    riskClass,
    payload: z.unknown(),
    toolName: z.string().max(128).optional(),
    autonomyLevel: z.number().int().min(0).max(5).optional(),
    hasGrounding: z.boolean().optional(),
    externalEffect: z.boolean().optional(),
  })).mutation(async ({ ctx, input }) => {
    await requireTenant(input.tenantKey, ctx.user);
    const profile = await listPvcProfiles(input.tenantKey);
    const selected = profile.find((item) => item.profileId === input.profileId);
    const definition = (selected?.definition ?? defaultPvcProfile()) as Record<string, unknown>;
    const result = validatePvc(input, definition);
    const validationId = `${result.validationId}-${nanoid(6)}`;
    const validation = await createPvcValidation({
      validationId,
      tenantKey: input.tenantKey,
      profileId: input.profileId,
      artifactType: input.artifactType,
      riskClass: result.riskClass,
      status: result.status,
      spheresPassed: result.spheresPassed,
      failedSphere: result.failedSphere,
      failureReason: result.failureReason,
      evidenceHash: result.evidenceHash,
      metadata: result.metadata,
    });
    await createPvcEvidence({
      evidenceId: `evi-${nanoid(12)}`,
      validationId,
      tenantKey: input.tenantKey,
      evidenceHash: result.evidenceHash,
      algorithm: "sha256",
      provenance: {
        operationId: input.operationId,
        artifactType: input.artifactType,
        profileId: input.profileId,
        generatedAt: new Date().toISOString(),
      },
    });
    return validation;
  }),
});
