import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWithBackoff } from "./_core/llm";

describe("LLM transport resilience", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("retries a transient HTTP failure and returns the recovered response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("busy", { status: 503 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await fetchWithBackoff("https://example.test", {});

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  }, 10_000);

  it("retries a network failure and succeeds without leaking the first error", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("temporary-network-error"))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await fetchWithBackoff("https://example.test", {});

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  }, 10_000);
});
