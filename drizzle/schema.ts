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

export const automationJobs = mysqlTable(
  "automation_jobs",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 160 }).notNull().unique(),
    description: text("description").notNull(),
    cronExpression: varchar("cronExpression", { length: 80 }).notNull(),
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
export type InsertUser = typeof users.$inferInsert;
export type CatalogItem = typeof catalogItems.$inferSelect;
export type MediaResource = typeof mediaResources.$inferSelect;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type EmailDraft = typeof emailDrafts.$inferSelect;
export type AutomationJob = typeof automationJobs.$inferSelect;
export type ChangelogEntry = typeof changelogEntries.$inferSelect;
