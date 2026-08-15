import { afterEach, describe, expect, it, vi } from "vitest";
import {
  notifyOperationalEvent,
  notifyOperationalFailure,
  resetOperationalNotificationDedupeForTests,
} from "./operationalNotifications";

describe("operational notifications", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    resetOperationalNotificationDedupeForTests();
  });

  it("deduplicates a relevant contact event without visitor data", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await notifyOperationalEvent({
      event: "contact_event",
      route: "/api/trpc/metrics.recordBusinessEvent",
      detail: "El embudo registró un nuevo evento de contacto.",
    });

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[1]?.body)).not.toContain("email");
  });

  it("redacts sensitive bodies and deduplicates repeated failures", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));
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
    const body = JSON.parse(
      fetchMock.mock.calls[0]?.[0]
        ? String(fetchMock.mock.calls[0]?.[1]?.body)
        : "{}"
    );
    expect(body.content).toContain("No se incluye cuerpo de solicitud");
    expect(body.content).not.toContain("originalBody");
    expect(body.content).not.toContain("SECRET_BODY");
  });
});
