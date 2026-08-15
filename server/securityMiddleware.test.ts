import { describe, expect, it, beforeEach } from "vitest";
import {
  browserMutationGuard,
  resetSecurityBucketsForTests,
  uploadGuard,
} from "./securityMiddleware";

function request(headers: Record<string, string> = {}, ip = "127.0.0.1") {
  return {
    method: "POST",
    ip,
    protocol: "https",
    header(name: string) {
      return headers[name.toLowerCase()];
    },
    get(name: string) {
      if (name.toLowerCase() === "host") return "127.0.0.1";
      return headers[name.toLowerCase()];
    },
  } as never;
}

function response() {
  const headers = new Map<string, string>();
  return {
    statusCode: 200,
    body: undefined as unknown,
    setHeader(name: string, value: string) {
      headers.set(name, value);
      return this;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: unknown) {
      this.body = body;
      return this;
    },
    getHeader(name: string) {
      return headers.get(name);
    },
  } as never;
}

describe("security middleware", () => {
  beforeEach(() => resetSecurityBucketsForTests());

  it("rejects explicit cross-site mutations", () => {
    const res = response();
    browserMutationGuard(
      request({
        origin: "https://evil.example",
        "sec-fetch-site": "cross-site",
      }),
      res,
      () => undefined
    );
    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: "cross-site-request" });
  });

  it("allows same-origin mutations and emits rate headers", () => {
    const res = response();
    let nextCalled = false;
    browserMutationGuard(
      request({
        origin: "https://127.0.0.1",
        cookie: "noiacore_csrf=test-token",
        "x-csrf-token": "test-token",
      }),
      res,
      () => {
        nextCalled = true;
      }
    );
    expect(nextCalled).toBe(true);
    expect(res.getHeader("X-RateLimit-Limit")).toBe("120");
  });

  it("rejects a browser mutation without a matching CSRF token", () => {
    const res = response();
    browserMutationGuard(
      request({
        origin: "https://127.0.0.1",
        cookie: "noiacore_csrf=test-token",
      }),
      res,
      () => undefined
    );
    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: "csrf-token-invalid" });
  });

  it("limits upload bursts independently", () => {
    for (let index = 0; index < 12; index += 1) {
      const res = response();
      uploadGuard(
        request({
          origin: "https://127.0.0.1",
          cookie: "noiacore_csrf=test-token",
          "x-csrf-token": "test-token",
        }),
        res,
        () => undefined
      );
      expect(res.statusCode).toBe(200);
    }
    const blocked = response();
    uploadGuard(
      request({
        origin: "https://127.0.0.1",
        cookie: "noiacore_csrf=test-token",
        "x-csrf-token": "test-token",
      }),
      blocked,
      () => undefined
    );
    expect(blocked.statusCode).toBe(429);
    expect(blocked.body).toEqual({ error: "rate-limit-exceeded" });
  });
});
