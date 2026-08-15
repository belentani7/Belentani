import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { getMetrics, recordAgent, recordScheduled } from "./observability";
import type { TrpcContext } from "./_core/context";

const context = {
  user: {
    id: 2,
    openId: "user",
    name: "User",
    email: "user@example.com",
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
} as TrpcContext;

describe("security and observability", () => {
  it("rejects a regular user from the admin summary", async () => {
    await expect(
      appRouter.createCaller(context).admin.summary()
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("records agent latency, fallbacks and scheduled outcomes", () => {
    const before = getMetrics();
    recordAgent(20, false);
    recordAgent(30, true);
    recordScheduled(true);
    recordScheduled(false);
    const after = getMetrics();
    expect(after.agentResponses).toBe(before.agentResponses + 2);
    expect(after.agentFallbacks).toBe(before.agentFallbacks + 1);
    expect(after.scheduledSuccess).toBe(before.scheduledSuccess + 1);
    expect(after.scheduledFailures).toBe(before.scheduledFailures + 1);
  });
});
