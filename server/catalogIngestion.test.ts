import { describe, expect, it } from "vitest";
import { assertAllowedSource, parseMarkdownSource } from "./catalogIngestion";

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
});
