import { describe, expect, it } from "vitest";
import {
  CATALOG_REFRESH_CALLBACK,
  GMAIL_INGEST_CALLBACK,
  GROWTH_REPORT_CALLBACK,
  AUTOMATION_RUN_POLICY,
  getAutomationReadiness,
  getFailureRunMetadata,
  getSchedulerAttempt,
} from "./automation";

describe("automation readiness", () => {
  it("keeps the retry and timeout policy bounded", () => {
    expect(AUTOMATION_RUN_POLICY).toEqual({
      maxAttempts: 3,
      timeoutMs: 120_000,
    });
  });
  it("requires production, the allowlisted callback and a task UID", () => {
    expect(
      getAutomationReadiness({
        callbackPath: CATALOG_REFRESH_CALLBACK,
        hasTaskUid: true,
        environment: "development",
      })
    ).toEqual({ ready: false, reason: "deployment-required" });

    expect(
      getAutomationReadiness({
        callbackPath: CATALOG_REFRESH_CALLBACK,
        hasTaskUid: false,
        environment: "production",
      })
    ).toEqual({ ready: false, reason: "callback-or-task-uid-missing" });

    expect(
      getAutomationReadiness({
        callbackPath: CATALOG_REFRESH_CALLBACK,
        hasTaskUid: true,
        environment: "production",
      })
    ).toEqual({ ready: true, reason: "callback-task-and-deployment-ready" });
    expect(
      getAutomationReadiness({
        callbackPath: GROWTH_REPORT_CALLBACK,
        hasTaskUid: true,
        environment: "production",
      })
    ).toEqual({ ready: true, reason: "callback-task-and-deployment-ready" });
    expect(
      getAutomationReadiness({
        callbackPath: GMAIL_INGEST_CALLBACK,
        hasTaskUid: true,
        environment: "production",
      })
    ).toEqual({ ready: true, reason: "callback-task-and-deployment-ready" });
  });

  it("normalizes the scheduler attempt and dead-letters only after exhaustion", () => {
    expect(getSchedulerAttempt({ headers: { "x-manus-attempt": "2" } })).toBe(
      2
    );
    expect(getSchedulerAttempt({ body: { attempt: 0 }, headers: {} })).toBe(1);
    expect(getFailureRunMetadata(2)).toEqual({
      quarantineReason: "callback-failure-awaiting-platform-retry",
    });
    const terminal = getFailureRunMetadata(3);
    expect(terminal.quarantineReason).toBe("retry-exhausted-dead-letter");
    expect(terminal.deadLetteredAt).toBeInstanceOf(Date);
  });
});
