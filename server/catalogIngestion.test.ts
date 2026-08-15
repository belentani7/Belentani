import { describe, expect, it } from "vitest";
import { vi } from "vitest";
import {
  assertAllowedSource,
  parseMarkdownSource,
  validateCandidates,
} from "./catalogIngestion";

describe("catalog ingestion", () => {
  it("parses traceable candidates and deduplicates URLs", () => {
    const result = parseMarkdownSource(
      "- [Tool One](https://github.com/example/tool) - Useful tool\n- [Tool One](https://github.com/example/tool)\n- [Tool Two](https://github.com/example/two)",
      {
        sourceName: "Source",
        sourceUrl: "https://github.com/example/list",
        category: "Tools",
        license: "MIT",
      }
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      sourceName: "Source",
      sourceUrl: "https://github.com/example/list",
      reviewStatus: "pending_review",
      status: "draft",
      license: "MIT",
    });
    expect(result[0]?.contentHash).toHaveLength(64);
  });

  it("rejects non-allowlisted source hosts", () => {
    expect(() =>
      assertAllowedSource("https://untrusted.example/list.md")
    ).toThrow("source-host-not-allowed");
  });

  it("quarantines candidates when the source network fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network-down"))
    );
    const candidates = parseMarkdownSource(
      "- [Tool](https://github.com/example/tool)",
      {
        sourceName: "Source",
        sourceUrl: "https://github.com/example/list",
        category: "Tools",
      }
    );
    const result = await validateCandidates(candidates);
    expect(result[0]).toMatchObject({
      reviewStatus: "quarantined",
      quarantineReason: "network-down",
    });
    vi.unstubAllGlobals();
  });

  it("keeps a candidate publishable for a successful 2xx validation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    );
    const candidates = parseMarkdownSource(
      "- [Tool](https://github.com/example/tool)",
      {
        sourceName: "Source",
        sourceUrl: "https://github.com/example/list",
        category: "Tools",
      }
    );
    const result = await validateCandidates(candidates);
    expect(result[0]?.reviewStatus).toBe("pending_review");
    vi.unstubAllGlobals();
  });
});
