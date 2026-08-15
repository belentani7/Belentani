import { describe, expect, it } from "vitest";

describe("business analytics contract", () => {
  it("defines only low-sensitivity funnel events", async () => {
    const source = await import("../client/src/lib/analytics");
    expect(source.trackBusinessEvent).toBeTypeOf("function");
    expect(
      source.trackBusinessEvent("contact_clicked", { source: "transparency" })
    ).toBeUndefined();
  });
});
