import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { getMetrics, recordBusinessEvent } from "./observability";
import type { TrpcContext } from "./_core/context";

const context = {
  user: null,
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("business analytics metrics", () => {
  it("counts allowlisted funnel events without storing payloads", () => {
    const before = getMetrics().businessEvents.catalog_opened ?? 0;
    recordBusinessEvent("catalog_opened");
    const after = getMetrics();
    expect(after.businessEvents.catalog_opened).toBe(before + 1);
    expect(after.businessEvents).not.toHaveProperty("message");
  });

  it("accepts and exposes the four public funnel surfaces through tRPC", async () => {
    const caller = appRouter.createCaller(context);
    for (const event of [
      "catalog_opened",
      "agent_opened",
      "resource_opened",
      "transparency_opened",
    ] as const) {
      await expect(
        caller.metrics.recordBusinessEvent({ event })
      ).resolves.toEqual({ success: true });
    }
    const metrics = await caller.metrics.public();
    expect(metrics.businessEvents).toMatchObject({
      catalog_opened: expect.any(Number),
      agent_opened: expect.any(Number),
      resource_opened: expect.any(Number),
      transparency_opened: expect.any(Number),
    });
  });
});
