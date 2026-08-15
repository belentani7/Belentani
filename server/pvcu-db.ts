import { and, desc, eq } from "drizzle-orm";
import {
  InsertPVCEvidence,
  InsertPVCException,
  InsertPVCProfile,
  InsertPVCTenant,
  InsertPVCValidation,
  pvcEvidence,
  pvcExceptions,
  pvcProfiles,
  pvcTenants,
  pvcValidations,
} from "../drizzle/schema";
import { getDb } from "./db";

export function canAccessPvcTenant(ownerOpenId: string, requestedOwnerOpenId: string, isAdmin: boolean) {
  return isAdmin || ownerOpenId === requestedOwnerOpenId;
}

export async function listPvcTenants(ownerOpenId: string, isAdmin: boolean) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(pvcTenants);
  return isAdmin ? query.orderBy(desc(pvcTenants.updatedAt)) : query.where(eq(pvcTenants.ownerOpenId, ownerOpenId)).orderBy(desc(pvcTenants.updatedAt));
}

export async function getPvcTenant(tenantKey: string, ownerOpenId: string, isAdmin: boolean) {
  const db = await getDb();
  if (!db) return undefined;
  const scope = isAdmin ? eq(pvcTenants.tenantKey, tenantKey) : and(eq(pvcTenants.tenantKey, tenantKey), eq(pvcTenants.ownerOpenId, ownerOpenId));
  const rows = await db.select().from(pvcTenants).where(scope).limit(1);
  return rows[0];
}

export async function createPvcTenant(input: InsertPVCTenant) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(pvcTenants).values(input);
  return getPvcTenant(input.tenantKey, input.ownerOpenId, false);
}

export async function listPvcProfiles(tenantKey: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pvcProfiles).where(eq(pvcProfiles.tenantKey, tenantKey)).orderBy(desc(pvcProfiles.updatedAt));
}

export async function getPvcProfile(tenantKey: string, profileId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(pvcProfiles).where(and(eq(pvcProfiles.tenantKey, tenantKey), eq(pvcProfiles.profileId, profileId))).orderBy(desc(pvcProfiles.updatedAt)).limit(1);
  return rows[0];
}

export async function createPvcProfile(input: InsertPVCProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(pvcProfiles).values(input);
  return getPvcProfile(input.tenantKey, input.profileId);
}

export async function listPvcValidations(tenantKey: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pvcValidations).where(eq(pvcValidations.tenantKey, tenantKey)).orderBy(desc(pvcValidations.createdAt)).limit(100);
}

export async function createPvcValidation(input: InsertPVCValidation) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(pvcValidations).values(input);
  const rows = await db.select().from(pvcValidations).where(eq(pvcValidations.validationId, input.validationId)).limit(1);
  return rows[0];
}

export async function listPvcEvidence(tenantKey: string, validationId?: string) {
  const db = await getDb();
  if (!db) return [];
  const scope = validationId ? and(eq(pvcEvidence.tenantKey, tenantKey), eq(pvcEvidence.validationId, validationId)) : eq(pvcEvidence.tenantKey, tenantKey);
  return db.select().from(pvcEvidence).where(scope).orderBy(desc(pvcEvidence.createdAt)).limit(100);
}

export async function createPvcEvidence(input: InsertPVCEvidence) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(pvcEvidence).values(input);
  const rows = await db.select().from(pvcEvidence).where(eq(pvcEvidence.evidenceId, input.evidenceId)).limit(1);
  return rows[0];
}

export async function listPvcExceptions(tenantKey: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pvcExceptions).where(eq(pvcExceptions.tenantKey, tenantKey)).orderBy(desc(pvcExceptions.createdAt)).limit(100);
}

export async function createPvcException(input: InsertPVCException) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(pvcExceptions).values(input);
  const rows = await db.select().from(pvcExceptions).where(eq(pvcExceptions.exceptionId, input.exceptionId)).limit(1);
  return rows[0];
}

export async function getPvcOverview(tenantKey: string) {
  const [profiles, validations, evidence, exceptions] = await Promise.all([
    listPvcProfiles(tenantKey),
    listPvcValidations(tenantKey),
    listPvcEvidence(tenantKey),
    listPvcExceptions(tenantKey),
  ]);
  const approved = validations.filter((item) => item.status === "approved").length;
  const blocked = validations.filter((item) => item.status === "rejected" || item.status === "quarantine").length;
  return {
    profiles,
    validations,
    evidence,
    exceptions,
    metrics: {
      validationCount: validations.length,
      evidenceCount: evidence.length,
      exceptionCount: exceptions.length,
      approved,
      blocked,
      review: validations.filter((item) => item.status === "human_review").length,
      approvalRate: validations.length ? Math.round((approved / validations.length) * 100) : 0,
      evidenceIntegrity: validations.every((item) => Boolean(item.evidenceHash)),
    },
  };
}
