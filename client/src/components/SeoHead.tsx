import { useEffect } from "react";

type SeoHeadProps = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  structuredData?: Record<string, unknown>;
};

const SITE_URL = "https://belentani.eu";

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string
) {
  let node = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`
  );
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }
  node.content = content;
}

export function SeoHead({
  title,
  description,
  path,
  type = "website",
  structuredData,
}: SeoHeadProps) {
  useEffect(() => {
    const canonical = new URL(path, SITE_URL).toString();
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    let link = document.head.querySelector<HTMLLinkElement>(
      "link[rel=canonical]"
    );
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    const scriptId = "belentani-route-schema";
    document.getElementById(scriptId)?.remove();
    if (structuredData) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
    return () => document.getElementById(scriptId)?.remove();
  }, [description, path, structuredData, title, type]);
  return null;
}
