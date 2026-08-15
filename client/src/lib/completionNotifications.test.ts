import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getCompletionNotificationPreferences,
  notifyCompletion,
  requestDesktopNotificationPermission,
  resetCompletionNotificationDedupeForTests,
  setCompletionNotificationPreferences,
} from "./completionNotifications";

function installWindow() {
  const values = new Map<string, string>();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
}

describe("completion notifications", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    resetCompletionNotificationDedupeForTests();
  });

  it("persists explicit preferences locally", () => {
    installWindow();
    setCompletionNotificationPreferences({ desktop: true, sound: false });
    expect(getCompletionNotificationPreferences()).toEqual({
      desktop: true,
      sound: false,
    });
  });

  it("deduplicates identical completion events", () => {
    installWindow();
    expect(notifyCompletion("Done")).toBe(false);
    expect(notifyCompletion("Done")).toBe(false);
  });

  it("falls back silently without Notification or AudioContext", async () => {
    installWindow();
    setCompletionNotificationPreferences({ desktop: true, sound: true });
    expect(notifyCompletion("Done")).toBe(false);
    await expect(requestDesktopNotificationPermission()).resolves.toBe(
      "unsupported"
    );
  });
});
