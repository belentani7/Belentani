import { describe, expect, it } from "vitest";
import {
  CATALOG_REFRESH_CALLBACK,
  GROWTH_REPORT_CALLBACK,
  getAutomationReadiness,
} from "./automation";

describe("automation readiness", () => {
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
  });
});
