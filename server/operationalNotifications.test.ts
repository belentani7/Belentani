import { afterEach, describe, expect, it, vi } from "vitest";
import {
  notifyOperationalFailure,
  resetOperationalNotificationDedupeForTests,
} from "./operationalNotifications";

describe("operational notifications", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    resetOperationalNotificationDedupeForTests();
  });

  it("redacts sensitive bodies and deduplicates repeated failures", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const first = await notifyOperationalFailure({
      event: "critical_failure",
      route: "/api/scheduled/test",
      taskUid: "task_123",
      error: "database unavailable",
    });
    const second = await notifyOperationalFailure({
      event: "critical_failure",
      route: "/api/scheduled/test",
      taskUid: "task_123",
      error: "database unavailable",
    });

    expect(first).toBe(true);
    expect(second).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0]?.[0] ? String(fetchMock.mock.calls[0]?.[1]?.body) : "{}");
    expect(body.content).toContain("No se incluye cuerpo de solicitud");
    expect(body.content).not.toContain("originalBody");
    expect(body.content).not.toContain("SECRET_BODY");
  });
});
