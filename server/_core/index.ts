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
import {
  automationJobs,
  catalogItems,
  mediaResources,
} from "../../drizzle/schema";
import { and, count, eq } from "drizzle-orm";
import { storagePut } from "../storage";
import { getMetrics, recordScheduled } from "../observability";

function logEvent(event: string, data: Record<string, unknown> = {}) {
  console.log(
    JSON.stringify({ timestamp: new Date().toISOString(), event, ...data })
  );
}
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
    if (!job || job.status === "paused")
      return res
        .status(200)
        .json({ ok: true, skipped: job ? "paused" : "orphan" });
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
    await db
      .update(automationJobs)
      .set({ lastRunAt: new Date(), status: "active" })
      .where(eq(automationJobs.id, job.id));
    recordScheduled(true);
    logEvent("scheduled_job_completed", {
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
    recordScheduled(false);
    logEvent("scheduled_job_failed", payload);
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
    return res.status(201).json({
      success: true,
      key: uploaded.key,
      url: uploaded.url,
      status: "draft",
    });
  } catch (error) {
    logEvent("media_upload_failed", {
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
  app.post(
    "/api/media/upload",
    express.raw({
      type: ["video/*", "audio/*", "application/pdf"],
      limit: "50mb",
    }),
    uploadMedia
  );
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({ router: appRouter, createContext })
  );
  if (process.env.NODE_ENV === "development") await setupVite(app, server);
  else serveStatic(app);
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort)
    logEvent("port_fallback", { preferredPort, port });
  server.listen(port, () =>
    logEvent("server_started", {
      port,
      environment: process.env.NODE_ENV || "development",
    })
  );
}

startServer().catch(error => {
  logEvent("server_start_failed", {
    error: error instanceof Error ? error.message : "unknown",
  });
  process.exitCode = 1;
});
