import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "./pages/Home";
import Transparency from "./pages/Transparency";
const Catalog = lazy(() => import("@/pages/Catalog"));
const Agent = lazy(() => import("@/pages/Agent"));
const Changelog = lazy(() => import("@/pages/Changelog"));
const Admin = lazy(() => import("@/pages/Admin"));
const Resources = lazy(() => import("@/pages/Resources"));
import { Route, Switch, useLocation } from "wouter";
import { SeoHead } from "./components/SeoHead";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function RouteSeo() {
  const [location] = useLocation();
  const metadata: Record<string, { title: string; description: string }> = {
    "/": {
      title: "Belentani Studio — Hacer visible lo que importa",
      description:
        "Percepción, estrategia, herramientas e inteligencia para construir una presencia digital que evoluciona.",
    },
    "/catalogo": {
      title: "Catálogo de herramientas — Belentani Studio",
      description:
        "Explora herramientas, métodos y referencias verificadas organizadas para avanzar con criterio.",
    },
    "/agente": {
      title: "Agente de marca — Belentani Studio",
      description:
        "Conversa con el agente de Belentani Studio para ordenar ideas, recursos y próximos pasos.",
    },
    "/recursos": {
      title: "Biblioteca multimedia — Belentani Studio",
      description:
        "Vídeos, voces, documentos y materiales de estudio con carga diferida y procedencia transparente.",
    },
    "/transparencia": {
      title: "Transparencia — Belentani Studio",
      description:
        "Criterios de procedencia, relaciones comerciales, privacidad y límites de la plataforma.",
    },
    "/changelog": {
      title: "Evolución del estudio — Belentani Studio",
      description:
        "Cambios, decisiones y mejoras verificables de la plataforma digital de Pedro Belentani.",
    },
  };
  const current = metadata[location] ?? metadata["/"];
  return (
    <SeoHead
      title={current.title}
      description={current.description}
      path={location}
      structuredData={{
        "@context": "https://schema.org",
        "@type": location === "/changelog" ? "Article" : "WebPage",
        name: current.title,
        description: current.description,
        url: `https://belentani.eu${location}`,
        isPartOf: {
          "@type": "WebSite",
          name: "Belentani Studio",
          url: "https://belentani.eu/",
        },
      }}
    />
  );
}

function Router() {
  return (
    <>
      <RouteSeo />
      <Suspense
        fallback={
          <main className="grid min-h-screen place-items-center bg-background text-foreground">
            <p className="text-sm text-muted-foreground" role="status">
              Cargando superficie…
            </p>
          </main>
        }
      >
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/catalogo" component={Catalog} />
          <Route path="/agente" component={Agent} />
          <Route path="/changelog" component={Changelog} />
          <Route path="/admin" component={Admin} />
          <Route path="/recursos" component={Resources} />
          <Route path={"/transparencia"} component={Transparency} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
