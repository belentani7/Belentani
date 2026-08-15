import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "editor", "admin"])
    .default("user")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const businessEvents = mysqlTable(
  "business_events",
  {
    id: int("id").autoincrement().primaryKey(),
    event: varchar("event", { length: 48 }).notNull(),
    occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  },
  table => ({
    eventIdx: index("business_event_name_idx").on(table.event),
    occurredAtIdx: index("business_event_time_idx").on(table.occurredAt),
  })
);

export const catalogItems = mysqlTable(
  "catalog_items",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    name: varchar("name", { length: 220 }).notNull(),
    category: varchar("category", { length: 120 }).notNull(),
    description: text("description").notNull(),
    url: varchar("url", { length: 500 }),
    canonicalUrl: varchar("canonicalUrl", { length: 700 }),
    tags: text("tags"),
    sourceName: varchar("sourceName", { length: 180 }),
    sourceUrl: varchar("sourceUrl", { length: 700 }),
    license: varchar("license", { length: 180 }),
    commercialRelation: varchar("commercialRelation", { length: 80 }),
    affiliateDisclosure: text("affiliateDisclosure"),
    contentHash: varchar("contentHash", { length: 128 }),
    ingestedAt: timestamp("ingestedAt"),
    reviewStatus: mysqlEnum("reviewStatus", [
      "pending_review",
      "approved",
      "quarantined",
      "rejected",
    ])
      .default("pending_review")
      .notNull(),
    quarantineReason: text("quarantineReason"),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    categoryIdx: index("catalog_category_idx").on(table.category),
    statusIdx: index("catalog_status_idx").on(table.status),
    reviewStatusIdx: index("catalog_review_status_idx").on(table.reviewStatus),
    sourceIdx: index("catalog_source_idx").on(table.sourceName),
    sourceCanonicalIdx: uniqueIndex("catalog_source_canonical_idx").on(
      table.sourceName,
      table.canonicalUrl
    ),
  })
);

export const mediaResources = mysqlTable(
  "media_resources",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    title: varchar("title", { length: 220 }).notNull(),
    kind: mysqlEnum("kind", ["video", "audio", "voice", "document"]).notNull(),
    description: text("description"),
    storageKey: varchar("storageKey", { length: 500 }).notNull(),
    publicUrl: varchar("publicUrl", { length: 700 }).notNull(),
    durationSeconds: int("durationSeconds"),
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    kindIdx: index("media_kind_idx").on(table.kind),
    statusIdx: index("media_status_idx").on(table.status),
  })
);

export const emailTemplates = mysqlTable("email_templates", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 120 }).notNull().unique(),
  subject: varchar("subject", { length: 300 }).notNull(),
  body: text("body").notNull(),
  status: mysqlEnum("status", ["draft", "active", "archived"])
    .default("draft")
    .notNull(),
  updatedByUserId: int("updatedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const emailDrafts = mysqlTable(
  "email_drafts",
  {
    id: int("id").autoincrement().primaryKey(),
    externalMessageId: varchar("externalMessageId", { length: 240 })
      .notNull()
      .unique(),
    fromAddress: varchar("fromAddress", { length: 320 }).notNull(),
    subject: varchar("subject", { length: 500 }).notNull(),
    receivedAt: timestamp("receivedAt").notNull(),
    category: varchar("category", { length: 120 }).notNull(),
    originalBody: text("originalBody").notNull(),
    draftBody: text("draftBody").notNull(),
    status: mysqlEnum("status", ["draft", "approved", "rejected", "archived"])
      .default("draft")
      .notNull(),
    reviewedByUserId: int("reviewedByUserId"),
    reviewedAt: timestamp("reviewedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    statusIdx: index("email_draft_status_idx").on(table.status),
    receivedIdx: index("email_draft_received_idx").on(table.receivedAt),
  })
);

export const emailDraftAudit = mysqlTable(
  "email_draft_audit",
  {
    id: int("id").autoincrement().primaryKey(),
    draftId: int("draftId").notNull(),
    actorUserId: int("actorUserId").notNull(),
    action: varchar("action", { length: 80 }).notNull(),
    previousStatus: varchar("previousStatus", { length: 32 }),
    nextStatus: varchar("nextStatus", { length: 32 }).notNull(),
    contentHashBefore: varchar("contentHashBefore", { length: 128 }),
    contentHashAfter: varchar("contentHashAfter", { length: 128 }),
    contentChanged: int("contentChanged").default(0).notNull(),
    occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  },
  table => ({
    draftIdx: index("email_draft_audit_draft_idx").on(table.draftId),
    actorIdx: index("email_draft_audit_actor_idx").on(table.actorUserId),
    occurredIdx: index("email_draft_audit_occurred_idx").on(table.occurredAt),
  })
);

export const automationRuns = mysqlTable(
  "automation_runs",
  {
    id: int("id").autoincrement().primaryKey(),
    jobId: int("jobId"),
    taskUid: varchar("taskUid", { length: 65 }),
    status: mysqlEnum("status", [
      "running",
      "succeeded",
      "failed",
      "skipped",
    ]).notNull(),
    startedAt: timestamp("startedAt").defaultNow().notNull(),
    finishedAt: timestamp("finishedAt"),
    durationMs: int("durationMs"),
    snapshot: text("snapshot"),
    error: text("error"),
  },
  table => ({
    jobIdx: index("automation_run_job_idx").on(table.jobId),
    statusIdx: index("automation_run_status_idx").on(table.status),
    startedIdx: index("automation_run_started_idx").on(table.startedAt),
  })
);

export const automationJobs = mysqlTable(
  "automation_jobs",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 160 }).notNull().unique(),
    description: text("description").notNull(),
    cronExpression: varchar("cronExpression", { length: 80 }).notNull(),
    callbackPath: varchar("callbackPath", { length: 120 })
      .default("/api/scheduled/catalog-refresh")
      .notNull(),
    scheduleCronTaskUid: varchar("schedule_cron_task_uid", { length: 65 }),
    status: mysqlEnum("status", ["draft", "active", "paused", "failed"])
      .default("draft")
      .notNull(),
    lastRunAt: timestamp("lastRunAt"),
    nextRunAt: timestamp("nextRunAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    taskUidIdx: index("automation_task_uid_idx").on(table.scheduleCronTaskUid),
    statusIdx: index("automation_status_idx").on(table.status),
  })
);

export const changelogEntries = mysqlTable(
  "changelog_entries",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    title: varchar("title", { length: 220 }).notNull(),
    summary: text("summary").notNull(),
    body: text("body").notNull(),
    publishedAt: timestamp("publishedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    publishedIdx: index("changelog_published_idx").on(table.publishedAt),
  })
);

export type User = typeof users.$inferSelect;
export type BusinessEvent = typeof businessEvents.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type CatalogItem = typeof catalogItems.$inferSelect;
export type MediaResource = typeof mediaResources.$inferSelect;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type EmailDraft = typeof emailDrafts.$inferSelect;
export type EmailDraftAudit = typeof emailDraftAudit.$inferSelect;
export type AutomationJob = typeof automationJobs.$inferSelect;
export type AutomationRun = typeof automationRuns.$inferSelect;
export type ChangelogEntry = typeof changelogEntries.$inferSelect;
