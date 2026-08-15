import { createHash } from "node:crypto";

const ALLOWED_HOSTS = new Set([
  "github.com",
  "raw.githubusercontent.com",
  "gist.githubusercontent.com",
]);
const LINK_PATTERN =
  /^\s*[-*]\s+\[([^\]]{2,220})\]\((https?:\/\/[^\s)]+)\)(?:\s*[-–—:]?\s*(.*))?\s*$/;

export type CatalogCandidate = {
  name: string;
  url: string;
  canonicalUrl: string;
  description: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
  license: string | null;
  contentHash: string;
  slug: string;
  ingestedAt: Date;
  status: "draft";
  reviewStatus: "pending_review" | "quarantined";
  quarantineReason: string | null;
};

export function canonicalizeUrl(value: string) {
  const parsed = new URL(value);
  parsed.hash = "";
  parsed.hostname = parsed.hostname.toLowerCase();
  if (parsed.pathname.endsWith("/"))
    parsed.pathname = parsed.pathname.slice(0, -1) || "/";
  return parsed.toString();
}

export function assertAllowedSource(sourceUrl: string) {
  const parsed = new URL(sourceUrl);
  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname))
    throw new Error("source-host-not-allowed");
}

export function parseMarkdownSource(
  markdown: string,
  input: {
    sourceName: string;
    sourceUrl: string;
    category: string;
    license?: string | null;
  }
): CatalogCandidate[] {
  assertAllowedSource(input.sourceUrl);
  const seen = new Set<string>();
  const candidates: CatalogCandidate[] = [];
  for (const line of markdown.split(/\r?\n/).slice(0, 50000)) {
    const match = line.match(LINK_PATTERN);
    if (!match) continue;
    const [, name, url, rawDescription] = match;
    const canonicalUrl = canonicalizeUrl(url);
    if (seen.has(canonicalUrl)) continue;
    seen.add(canonicalUrl);
    const contentHash = createHash("sha256")
      .update(`${input.sourceName}\n${canonicalUrl}`)
      .digest("hex");
    candidates.push({
      name: name.trim(),
      url,
      canonicalUrl,
      description: (
        rawDescription?.trim() ||
        `Recurso descubierto en ${input.sourceName}. Requiere revisión editorial.`
      ).slice(0, 5000),
      category: input.category,
      sourceName: input.sourceName,
      sourceUrl: input.sourceUrl,
      license: input.license ?? null,
      contentHash,
      slug: `${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 140)}-${contentHash.slice(0, 12)}`,
      ingestedAt: new Date(),
      status: "draft",
      reviewStatus: "pending_review",
      quarantineReason: null,
    });
    if (candidates.length >= 5000) break;
  }
  return candidates;
}

export async function validateCandidateUrl(
  url: string
): Promise<{ ok: boolean; reason: string | null }> {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:")
      return { ok: false, reason: "non-https-url" };
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
      redirect: "manual",
      headers: { "user-agent": "BelentaniStudioCatalogBot/1.0" },
    });
    if (response.status >= 200 && response.status < 400)
      return { ok: true, reason: null };
    return { ok: false, reason: `url-status-${response.status}` };
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof Error
          ? error.message.slice(0, 180)
          : "url-validation-failed",
    };
  }
}

export async function validateCandidates(candidates: CatalogCandidate[]) {
  const results: CatalogCandidate[] = [];
  for (let index = 0; index < candidates.length; index += 8) {
    const batch = candidates.slice(index, index + 8);
    const checked = await Promise.all(
      batch.map(async candidate => {
        const validation = await validateCandidateUrl(candidate.url);
        return validation.ok
          ? candidate
          : {
              ...candidate,
              reviewStatus: "quarantined" as const,
              quarantineReason: validation.reason,
            };
      })
    );
    results.push(...checked);
  }
  return results;
}

export async function fetchAllowedSource(sourceUrl: string) {
  assertAllowedSource(sourceUrl);
  const response = await fetch(sourceUrl, {
    signal: AbortSignal.timeout(15000),
    headers: { "user-agent": "BelentaniStudioCatalogBot/1.0" },
  });
  if (!response.ok) throw new Error(`source-fetch-${response.status}`);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text") && !sourceUrl.endsWith(".md"))
    throw new Error("source-content-type-not-allowed");
  return response.text();
}
