import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { sdk } from "./sdk";
import { getDb } from "../db";
import { recordAdminAction } from "../adminAudit";
import {
  automationJobs,
  automationRuns,
  businessEvents,
  catalogItems,
  mediaResources,
} from "../../drizzle/schema";
import { and, count, eq } from "drizzle-orm";
import { storagePut } from "../storage";
import { getMetrics, recordScheduled } from "../observability";
import {
  AUTOMATION_RUN_POLICY,
  GROWTH_REPORT_CALLBACK,
  getFailureRunMetadata,
  getSchedulerAttempt,
} from "../automation";
import { logError, logInfo, logWarn } from "../structuredLogger";
import { notifyOperationalFailure } from "../operationalNotifications";
import { ingestAuthorizedEmails } from "../emailIngestion";
import {
  browserMutationGuard,
  csrfCookieMiddleware,
  uploadGuard,
} from "../securityMiddleware";
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function scheduledCatalogRefresh(
  req: express.Request,
  res: express.Response
) {
  const startedAt = Date.now();
  const schedulerAttempt = getSchedulerAttempt(req);
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid)
      return res.status(403).json({ error: "cron-only" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "database-unavailable" });
    const job = (
      await db
        .select()
        .from(automationJobs)
        .where(eq(automationJobs.scheduleCronTaskUid, user.taskUid))
        .limit(1)
    )[0];
    if (!job || job.status === "paused") {
      await db.insert(automationRuns).values({
        jobId: job?.id ?? null,
        taskUid: user.taskUid,
        status: "skipped",
        attempt: schedulerAttempt,
        maxAttempts: AUTOMATION_RUN_POLICY.maxAttempts,
        timeoutMs: AUTOMATION_RUN_POLICY.timeoutMs,
        quarantineReason: job ? "job-paused" : "orphan-task",
        deadLetteredAt: job ? undefined : new Date(),
        finishedAt: new Date(),
        durationMs: Date.now() - startedAt,
        error: job ? "job-paused" : "orphan-task",
      });
      return res
        .status(200)
        .json({ ok: true, skipped: job ? "paused" : "orphan" });
    }
    const [totalRows, publishedRows, pendingRows, quarantinedRows] =
      await Promise.all([
        db.select({ value: count() }).from(catalogItems),
        db
          .select({ value: count() })
          .from(catalogItems)
          .where(
            and(
              eq(catalogItems.status, "published"),
              eq(catalogItems.reviewStatus, "approved")
            )
          ),
        db
          .select({ value: count() })
          .from(catalogItems)
          .where(eq(catalogItems.reviewStatus, "pending_review")),
        db
          .select({ value: count() })
          .from(catalogItems)
          .where(eq(catalogItems.reviewStatus, "quarantined")),
      ]);
    const snapshot = {
      total: totalRows[0]?.value ?? 0,
      published: publishedRows[0]?.value ?? 0,
      pendingReview: pendingRows[0]?.value ?? 0,
      quarantined: quarantinedRows[0]?.value ?? 0,
    };
    const finishedAt = new Date();
    await db.insert(automationRuns).values({
      jobId: job.id,
      taskUid: user.taskUid,
      status: "succeeded",
      attempt: schedulerAttempt,
      maxAttempts: AUTOMATION_RUN_POLICY.maxAttempts,
      timeoutMs: AUTOMATION_RUN_POLICY.timeoutMs,
      startedAt: new Date(startedAt),
      finishedAt,
      durationMs: Date.now() - startedAt,
      snapshot: JSON.stringify(snapshot),
    });
    await db
      .update(automationJobs)
      .set({ lastRunAt: finishedAt, status: "active" })
      .where(eq(automationJobs.id, job.id));
    recordScheduled(true);
    logInfo("scheduled_job_completed", {
      jobId: job.id,
      taskUid: user.taskUid,
      snapshot,
      durationMs: Date.now() - startedAt,
    });
    return res.json({ ok: true, jobId: job.id, snapshot });
  } catch (error) {
    const payload = {
      error: error instanceof Error ? error.message : "unknown",
      context: { url: req.originalUrl },
      timestamp: new Date().toISOString(),
    };
    try {
      const db = await getDb();
      if (db) {
        await db.insert(automationRuns).values({
          status: "failed",
          attempt: schedulerAttempt,
          maxAttempts: AUTOMATION_RUN_POLICY.maxAttempts,
          timeoutMs: AUTOMATION_RUN_POLICY.timeoutMs,
          ...getFailureRunMetadata(schedulerAttempt),
          startedAt: new Date(startedAt),
          finishedAt: new Date(),
          durationMs: Date.now() - startedAt,
          error: payload.error,
        });
      }
    } catch {
      // Preserve the original failure response if persistence is unavailable.
    }
    recordScheduled(false);
    logError("scheduled_job_failed", payload);
    void notifyOperationalFailure({
      event: "scheduled_job_failed",
      route: req.originalUrl,
      taskUid: undefined,
      error: payload.error,
    });
    return res.status(500).json(payload);
  }
}

async function scheduledGrowthReport(
  req: express.Request,
  res: express.Response
) {
  const startedAt = Date.now();
  const schedulerAttempt = getSchedulerAttempt(req);
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid)
      return res.status(403).json({ error: "cron-only" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "database-unavailable" });
    const job = (
      await db
        .select()
        .from(automationJobs)
        .where(eq(automationJobs.scheduleCronTaskUid, user.taskUid))
        .limit(1)
    )[0];
    if (!job || job.status === "paused") {
      await db.insert(automationRuns).values({
        jobId: job?.id ?? null,
        taskUid: user.taskUid,
        status: "skipped",
        attempt: schedulerAttempt,
        maxAttempts: AUTOMATION_RUN_POLICY.maxAttempts,
        timeoutMs: AUTOMATION_RUN_POLICY.timeoutMs,
        quarantineReason: job ? "job-paused" : "orphan-task",
        deadLetteredAt: job ? undefined : new Date(),
        finishedAt: new Date(),
        durationMs: Date.now() - startedAt,
        error: job ? "job-paused" : "orphan-task",
      });
      return res
        .status(200)
        .json({ ok: true, skipped: job ? "paused" : "orphan" });
    }
    const eventRows = await db
      .select({ event: businessEvents.event, value: count() })
      .from(businessEvents)
      .groupBy(businessEvents.event);
    const snapshot = {
      generatedAt: new Date().toISOString(),
      metrics: getMetrics(),
      businessEvents: Object.fromEntries(
        eventRows.map(row => [row.event, Number(row.value)])
      ),
    };
    const finishedAt = new Date();
    await db.insert(automationRuns).values({
      jobId: job.id,
      taskUid: user.taskUid,
      status: "succeeded",
      attempt: schedulerAttempt,
      maxAttempts: AUTOMATION_RUN_POLICY.maxAttempts,
      timeoutMs: AUTOMATION_RUN_POLICY.timeoutMs,
      startedAt: new Date(startedAt),
      finishedAt,
      durationMs: Date.now() - startedAt,
      snapshot: JSON.stringify(snapshot),
    });
    await db
      .update(automationJobs)
      .set({ lastRunAt: finishedAt, status: "active" })
      .where(eq(automationJobs.id, job.id));
    recordScheduled(true);
    logInfo("growth_report_completed", {
      jobId: job.id,
      taskUid: user.taskUid,
      durationMs: Date.now() - startedAt,
    });
    return res.json({ ok: true, jobId: job.id, snapshot });
  } catch (error) {
    const payload = {
      error: error instanceof Error ? error.message : "unknown",
      context: { url: req.originalUrl },
      timestamp: new Date().toISOString(),
    };
    try {
      const db = await getDb();
      if (db)
        await db.insert(automationRuns).values({
          status: "failed",
          attempt: schedulerAttempt,
          maxAttempts: AUTOMATION_RUN_POLICY.maxAttempts,
          timeoutMs: AUTOMATION_RUN_POLICY.timeoutMs,
          ...getFailureRunMetadata(schedulerAttempt),
          startedAt: new Date(startedAt),
          finishedAt: new Date(),
          durationMs: Date.now() - startedAt,
          error: payload.error,
        });
    } catch {
      // Preserve the original failure response if persistence is unavailable.
    }
    recordScheduled(false);
    logError("growth_report_failed", payload);
    void notifyOperationalFailure({
      event: "growth_report_failed",
      route: req.originalUrl,
      taskUid: undefined,
      error: payload.error,
    });
    return res.status(500).json(payload);
  }
}

async function scheduledGmailIngest(
  req: express.Request,
  res: express.Response
) {
  const startedAt = Date.now();
  const schedulerAttempt = getSchedulerAttempt(req);
  let taskUid: string | undefined;
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid)
      return res.status(403).json({ error: "cron-only" });
    taskUid = user.taskUid;
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "database-unavailable" });
    const job = (
      await db
        .select()
        .from(automationJobs)
        .where(eq(automationJobs.scheduleCronTaskUid, taskUid))
        .limit(1)
    )[0];
    if (!job || job.status === "paused") {
      await db.insert(automationRuns).values({
        jobId: job?.id ?? null,
        taskUid: taskUid,
        status: "skipped",
        attempt: schedulerAttempt,
        maxAttempts: AUTOMATION_RUN_POLICY.maxAttempts,
        timeoutMs: AUTOMATION_RUN_POLICY.timeoutMs,
        quarantineReason: job ? "job-paused" : "orphan-task",
        deadLetteredAt: job ? undefined : new Date(),
        finishedAt: new Date(),
        durationMs: Date.now() - startedAt,
        error: job ? "job-paused" : "orphan-task",
      });
      return res
        .status(200)
        .json({ ok: true, skipped: job ? "paused" : "orphan" });
    }
    const rawMessages = req.body?.messages;
    if (!Array.isArray(rawMessages) || rawMessages.length > 20)
      return res.status(400).json({ error: "invalid-message-batch" });
    const messages = rawMessages.map(message => {
      if (!message || typeof message !== "object")
        throw new Error("invalid-message");
      const value = message as Record<string, unknown>;
      const receivedAt = new Date(String(value.receivedAt ?? ""));
      if (Number.isNaN(receivedAt.getTime())) throw new Error("invalid-date");
      return {
        externalMessageId: String(value.externalMessageId ?? ""),
        fromAddress: String(value.fromAddress ?? ""),
        subject: String(value.subject ?? ""),
        originalBody: String(value.originalBody ?? ""),
        receivedAt,
      };
    });
    const results = await ingestAuthorizedEmails(messages);
    const finishedAt = new Date();
    const snapshot = { received: messages.length, drafts: results.length };
    await db.insert(automationRuns).values({
      jobId: job.id,
      taskUid: taskUid,
      status: "succeeded",
      attempt: schedulerAttempt,
      maxAttempts: AUTOMATION_RUN_POLICY.maxAttempts,
      timeoutMs: AUTOMATION_RUN_POLICY.timeoutMs,
      startedAt: new Date(startedAt),
      finishedAt,
      durationMs: Date.now() - startedAt,
      snapshot: JSON.stringify(snapshot),
    });
    await db
      .update(automationJobs)
      .set({ lastRunAt: finishedAt, status: "active" })
      .where(eq(automationJobs.id, job.id));
    logInfo("gmail_ingest_completed", {
      jobId: job.id,
      taskUid: taskUid,
      snapshot,
      durationMs: Date.now() - startedAt,
    });
    return res.json({ ok: true, ...snapshot });
  } catch (error) {
    const payload = {
      error: error instanceof Error ? error.message : "unknown",
      context: { url: req.originalUrl },
      timestamp: new Date().toISOString(),
    };
    try {
      const db = await getDb();
      if (db)
        await db.insert(automationRuns).values({
          status: "failed",
          attempt: schedulerAttempt,
          maxAttempts: AUTOMATION_RUN_POLICY.maxAttempts,
          timeoutMs: AUTOMATION_RUN_POLICY.timeoutMs,
          ...getFailureRunMetadata(schedulerAttempt),
          startedAt: new Date(startedAt),
          finishedAt: new Date(),
          durationMs: Date.now() - startedAt,
          error: payload.error,
        });
    } catch {
      // Preserve the original failure response if persistence is unavailable.
    }
    logError("gmail_ingest_failed", payload);
    void notifyOperationalFailure({
      event: "gmail_ingest_failed",
      route: req.originalUrl,
      taskUid: taskUid,
      error: payload.error,
    });
    return res.status(500).json(payload);
  }
}

async function uploadMedia(req: express.Request, res: express.Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (user.role !== "admin" && user.role !== "editor")
      return res.status(403).json({ error: "forbidden" });
    const body = Buffer.isBuffer(req.body) ? req.body : Buffer.from([]);
    const title = String(req.header("x-media-title") ?? "").trim();
    const kind = String(req.header("x-media-kind") ?? "").trim();
    const description = String(req.header("x-media-description") ?? "").trim();
    if (
      !body.length ||
      !title ||
      !["video", "audio", "voice", "document"].includes(kind)
    )
      return res.status(400).json({ error: "invalid-media-metadata" });
    const contentType =
      req.header("content-type") ?? "application/octet-stream";
    const safeName =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 120) || "resource";
    const uploaded = await storagePut(
      `belentani-media/${safeName}`,
      body,
      contentType
    );
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "database-unavailable" });
    const slug = `${safeName}-${Date.now().toString(36)}`;
    await db.insert(mediaResources).values({
      slug,
      title,
      kind: kind as "video" | "audio" | "voice" | "document",
      description: description || null,
      storageKey: uploaded.key,
      publicUrl: uploaded.url,
      status: "draft",
    });
    await recordAdminAction({
      actorUserId: user.id,
      action: "media_upload",
      entityType: "media_resource",
      outcome: "success",
    });
    return res.status(201).json({
      success: true,
      key: uploaded.key,
      url: uploaded.url,
      status: "draft",
    });
  } catch (error) {
    logError("media_upload_failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return res.status(500).json({ error: "media-upload-failed" });
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use("/api", csrfCookieMiddleware);
  app.get("/api/health", (_req, res) =>
    res.status(200).json({
      ok: true,
      service: "belentani-studio-platform",
      timestamp: new Date().toISOString(),
      metrics: getMetrics(),
    })
  );
  app.get("/api/metrics", (_req, res) => res.status(200).json(getMetrics()));
  app.post("/api/scheduled/catalog-refresh", scheduledCatalogRefresh);
  app.post("/api/scheduled/growth-report", scheduledGrowthReport);
  app.post("/api/scheduled/gmail-ingest", scheduledGmailIngest);
  app.post(
    "/api/media/upload",
    uploadGuard,
    express.raw({
      type: ["video/*", "audio/*", "application/pdf"],
      limit: "50mb",
    }),
    uploadMedia
  );
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use("/api/trpc", browserMutationGuard);
  app.use(
    "/api/trpc",
    createExpressMiddleware({ router: appRouter, createContext })
  );
  if (process.env.NODE_ENV === "development") await setupVite(app, server);
  else serveStatic(app);
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) logWarn("port_fallback", { preferredPort, port });
  server.listen(port, () =>
    logInfo("server_started", {
      port,
      environment: process.env.NODE_ENV || "development",
    })
  );
}

startServer().catch(error => {
  logError("server_start_failed", {
    error: error instanceof Error ? error.message : "unknown",
  });
  process.exitCode = 1;
});
