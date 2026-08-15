import { randomBytes } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const WINDOW_MS = 60_000;
const MAX_MUTATIONS_PER_WINDOW = 120;
const MAX_UPLOADS_PER_WINDOW = 12;
const CSRF_COOKIE = "noiacore_csrf";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function clientKey(req: Request) {
  const forwarded = req.header("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.ip || "unknown";
}

function cookieValue(req: Request, name: string) {
  const raw = req.header("cookie") ?? "";
  const pair = raw
    .split(";")
    .find(value => value.trim().startsWith(`${name}=`));
  return pair?.trim().slice(name.length + 1);
}

function allowedOrigin(req: Request) {
  const origin = req.header("origin");
  const referer = req.header("referer");
  const expected = `${req.protocol}://${req.get("host")}`;
  if (origin && origin !== expected) return false;
  if (!origin && referer && !referer.startsWith(`${expected}/`)) return false;
  const fetchSite = req.header("sec-fetch-site");
  return fetchSite !== "cross-site";
}

function isBrowserRequest(req: Request) {
  return Boolean(
    req.header("origin") ||
      req.header("referer") ||
      req.header("sec-fetch-site")
  );
}

export function csrfCookieMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!cookieValue(req, CSRF_COOKIE)) {
    const token = randomBytes(24).toString("hex");
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    res.setHeader(
      "Set-Cookie",
      `${CSRF_COOKIE}=${token}; Path=/; SameSite=Lax; Max-Age=86400${secure}`
    );
  }
  next();
}

function verifyBrowserCsrf(req: Request) {
  if (!isBrowserRequest(req)) return true;
  const cookieToken = cookieValue(req, CSRF_COOKIE);
  const headerToken = req.header("x-csrf-token");
  return Boolean(cookieToken && headerToken && cookieToken === headerToken);
}

function rateLimit(limit: number, bucketName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = `${bucketName}:${clientKey(req)}`;
    const existing = buckets.get(key);
    const bucket =
      !existing || existing.resetAt <= now
        ? { count: 0, resetAt: now + WINDOW_MS }
        : existing;
    bucket.count += 1;
    buckets.set(key, bucket);
    if (buckets.size > 10_000) {
      buckets.forEach((entry, entryKey) => {
        if (entry.resetAt <= now) buckets.delete(entryKey);
      });
    }
    res.setHeader("X-RateLimit-Limit", String(limit));
    res.setHeader(
      "X-RateLimit-Remaining",
      String(Math.max(0, limit - bucket.count))
    );
    res.setHeader(
      "X-RateLimit-Reset",
      String(Math.ceil(bucket.resetAt / 1000))
    );
    if (bucket.count > limit) {
      res.setHeader(
        "Retry-After",
        String(Math.ceil((bucket.resetAt - now) / 1000))
      );
      return res.status(429).json({ error: "rate-limit-exceeded" });
    }
    next();
  };
}

export function browserMutationGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
  if (!allowedOrigin(req))
    return res.status(403).json({ error: "cross-site-request" });
  if (!verifyBrowserCsrf(req))
    return res.status(403).json({ error: "csrf-token-invalid" });
  return rateLimit(MAX_MUTATIONS_PER_WINDOW, "mutation")(req, res, next);
}

export function uploadGuard(req: Request, res: Response, next: NextFunction) {
  if (!allowedOrigin(req))
    return res.status(403).json({ error: "cross-site-request" });
  if (!verifyBrowserCsrf(req))
    return res.status(403).json({ error: "csrf-token-invalid" });
  return rateLimit(MAX_UPLOADS_PER_WINDOW, "upload")(req, res, next);
}

export function resetSecurityBucketsForTests() {
  buckets.clear();
}

export const csrfCookieName = CSRF_COOKIE;
