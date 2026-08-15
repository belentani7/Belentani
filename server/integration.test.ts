import { describe, expect, it } from "vitest";

const baseUrl = process.env.INTEGRATION_BASE_URL ?? "http://127.0.0.1:3000";

describe("HTTP integration flow", () => {
  it("serves health, metrics and route-specific SEO through the running server", async () => {
    const health = await fetch(`${baseUrl}/api/health`);
    expect(health.status).toBe(200);
    expect(await health.json()).toMatchObject({ ok: true });

    const metrics = await fetch(`${baseUrl}/api/metrics`);
    expect(metrics.status).toBe(200);
    expect(await metrics.json()).toHaveProperty("businessEvents");

    const trpcMetrics = await fetch(
      `${baseUrl}/api/trpc/metrics.public?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%7D%7D`
    );
    expect(trpcMetrics.status).toBe(200);
    const trpcPayload = (await trpcMetrics.json()) as Array<{
      result?: { data?: { json?: Record<string, unknown> } };
    }>;
    expect(trpcPayload[0]?.result?.data?.json).toHaveProperty("businessEvents");

    const catalog = await fetch(`${baseUrl}/catalogo`);
    expect(catalog.status).toBe(200);
    const html = await catalog.text();
    expect(html).toContain("Catálogo de herramientas — Belentani Studio");
    expect(html).toContain('href="https://belentani.eu/catalogo"');
    expect(html).toContain('type="application/ld+json"');
  });
});
