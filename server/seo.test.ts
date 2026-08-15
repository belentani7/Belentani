import { describe, expect, it } from "vitest";
import { renderRouteSeoHtml } from "./seo";

const template = `<!doctype html><html><head><title>Base</title><meta name="description" content="base" /><meta property="og:type" content="website" /><meta property="og:title" content="base" /><meta property="og:description" content="base" /><meta name="twitter:card" content="summary" /><meta name="twitter:title" content="base" /><meta name="twitter:description" content="base" /><link rel="canonical" href="https://belentani.eu/" /><script type="application/ld+json">{"@type":"WebSite"}</script></head></html>`;

describe("server-side route SEO", () => {
  it("renders route-specific metadata in the initial HTML", () => {
    const html = renderRouteSeoHtml(template, "/catalogo");
    expect(html).toContain("Catálogo de herramientas — Belentani Studio");
    expect(html).toContain('href="https://belentani.eu/catalogo"');
    expect(html).toContain('name="twitter:card" content="summary"');
    expect(html).toContain('"@type":"WebPage"');
  });
});
