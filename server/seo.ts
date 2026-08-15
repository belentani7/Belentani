export type RouteSeo = {
  title: string;
  description: string;
  type: "website" | "article";
};

const siteUrl = "https://belentani.eu";

const routeSeo: Record<string, RouteSeo> = {
  "/": {
    title: "Belentani Studio — Hacer visible lo que importa",
    description:
      "Percepción, estrategia, herramientas e inteligencia para construir una presencia digital que evoluciona.",
    type: "website",
  },
  "/catalogo": {
    title: "Catálogo de herramientas — Belentani Studio",
    description:
      "Explora herramientas, métodos y referencias verificadas organizadas para avanzar con criterio.",
    type: "website",
  },
  "/agente": {
    title: "Agente de marca — Belentani Studio",
    description:
      "Conversa con el agente de Belentani Studio para ordenar ideas, recursos y próximos pasos.",
    type: "website",
  },
  "/recursos": {
    title: "Biblioteca multimedia — Belentani Studio",
    description:
      "Vídeos, voces, documentos y materiales de estudio con carga diferida y procedencia transparente.",
    type: "website",
  },
  "/transparencia": {
    title: "Transparencia — Belentani Studio",
    description:
      "Criterios de procedencia, relaciones comerciales, privacidad y límites de la plataforma.",
    type: "website",
  },
  "/changelog": {
    title: "Evolución del estudio — Belentani Studio",
    description:
      "Cambios, decisiones y mejoras verificables de la plataforma digital de Pedro Belentani.",
    type: "article",
  },
};

export function getRouteSeo(pathname: string): RouteSeo {
  return routeSeo[pathname] ?? routeSeo["/"];
}

export function renderRouteSeoHtml(template: string, pathname: string) {
  const seo = getRouteSeo(pathname);
  const canonical = new URL(pathname, siteUrl).toString();
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": seo.type === "article" ? "Article" : "WebPage",
    name: seo.title,
    description: seo.description,
    url: canonical,
    isPartOf: {
      "@type": "WebSite",
      name: "Belentani Studio",
      url: `${siteUrl}/`,
    },
  });
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${seo.title}</title>`)
    .replace(
      /(<meta name="description" content=")[^"]*("\s*\/?>)/,
      `$1${seo.description}$2`
    )
    .replace(
      /(<meta property="og:type" content=")[^"]*("\s*\/?>)/,
      `$1${seo.type}$2`
    )
    .replace(
      /(<meta property="og:title" content=")[^"]*("\s*\/?>)/,
      `$1${seo.title}$2`
    )
    .replace(
      /(<meta property="og:description" content=")[^"]*("\s*\/?>)/,
      `$1${seo.description}$2`
    )
    .replace(
      /(<meta name="twitter:card" content=")[^"]*("\s*\/?>)/,
      `$1summary$2`
    )
    .replace(
      /(<meta name="twitter:title" content=")[^"]*("\s*\/?>)/,
      `$1${seo.title}$2`
    )
    .replace(
      /(<meta name="twitter:description" content=")[^"]*("\s*\/?>)/,
      `$1${seo.description}$2`
    )
    .replace(
      /(<link rel="canonical" href=")[^"]*("\s*\/?>)/,
      `$1${canonical}$2`
    )
    .replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${schema}</script>`
    );
}
