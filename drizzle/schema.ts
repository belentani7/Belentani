import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * PVC-U Tenants table for Multi-Tenant isolation
 */
export const pvcTenants = mysqlTable("pvc_tenants", {
  id: int("id").autoincrement().primaryKey(),
  tenantKey: varchar("tenantKey", { length: 64 }).notNull().unique(),
  ownerOpenId: varchar("ownerOpenId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  tier: mysqlEnum("tier", ["individual", "business", "enterprise"]).default("business").notNull(),
  status: mysqlEnum("status", ["active", "suspended", "quarantine"]).default("active").notNull(),
  config: json("config"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PVCTenant = typeof pvcTenants.$inferSelect;
export type InsertPVCTenant = typeof pvcTenants.$inferInsert;

/**
 * PVC-U Validation Profiles table
 */
export const pvcProfiles = mysqlTable("pvc_profiles", {
  id: int("id").autoincrement().primaryKey(),
  tenantKey: varchar("tenantKey", { length: 64 }).notNull(),
  profileId: varchar("profileId", { length: 128 }).notNull(),
  version: varchar("version", { length: 32 }).notNull(),
  riskClass: mysqlEnum("riskClass", ["low", "medium", "high", "critical"]).notNull(),
  domain: varchar("domain", { length: 64 }).notNull(),
  definition: json("definition").notNull(),
  status: mysqlEnum("status", ["draft", "active", "deprecated", "archived"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PVCProfile = typeof pvcProfiles.$inferSelect;
export type InsertPVCProfile = typeof pvcProfiles.$inferInsert;

/**
 * PVC-U Validation Runs & Evidence table
 */
export const pvcValidations = mysqlTable("pvc_validations", {
  id: int("id").autoincrement().primaryKey(),
  validationId: varchar("validationId", { length: 64 }).notNull().unique(),
  tenantKey: varchar("tenantKey", { length: 64 }).notNull(),
  profileId: varchar("profileId", { length: 128 }).notNull(),
  artifactType: varchar("artifactType", { length: 64 }).notNull(), // request, event, response, action, model
  riskClass: varchar("riskClass", { length: 32 }).notNull(),
  status: mysqlEnum("status", ["approved", "rejected", "quarantine", "degraded", "human_review"]).notNull(),
  spheresPassed: json("spheresPassed"),
  failedSphere: varchar("failedSphere", { length: 64 }),
  failureReason: text("failureReason"),
  evidenceHash: varchar("evidenceHash", { length: 128 }).notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PVCValidation = typeof pvcValidations.$inferSelect;
export type InsertPVCValidation = typeof pvcValidations.$inferInsert;

/**
 * PVC-U Exceptions table
 */
export const pvcExceptions = mysqlTable("pvc_exceptions", {
  id: int("id").autoincrement().primaryKey(),
  exceptionId: varchar("exceptionId", { length: 64 }).notNull().unique(),
  tenantKey: varchar("tenantKey", { length: 64 }).notNull(),
  profileId: varchar("profileId", { length: 128 }).notNull(),
  reason: text("reason").notNull(),
  compensatingControls: text("compensatingControls").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  approvedBy: varchar("approvedBy", { length: 128 }).notNull(),
  status: mysqlEnum("status", ["active", "expired", "revoked"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PVCException = typeof pvcExceptions.$inferSelect;
export type InsertPVCException = typeof pvcExceptions.$inferInsert;
