import { Link } from "wouter";
import {
  ArrowUpRight,
  Bot,
  Compass,
  Mail,
  Play,
  Search,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pillars = [
  {
    icon: Compass,
    label: "Percepción",
    text: "Sistemas visuales que ordenan la atención y hacen visible lo esencial.",
  },
  {
    icon: Workflow,
    label: "Herramientas",
    text: "Un catálogo vivo para descubrir recursos, métodos y tecnología útil.",
  },
  {
    icon: Sparkles,
    label: "Evolución",
    text: "Una plataforma que registra sus mejoras y crece con criterio.",
  },
];

const featured = [
  {
    category: "Dirección",
    title: "Mapa de claridad",
    text: "Una selección para convertir complejidad en decisiones visibles.",
  },
  {
    category: "IA responsable",
    title: "Agente Belentani",
    text: "Conversación contextual con límites, fallback y revisión humana.",
  },
  {
    category: "Recursos",
    title: "Biblioteca multimedia",
    text: "Vídeos, voces y materiales preparados para explorar sin fricción.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,hsl(var(--accent)/.16),transparent_34%),radial-gradient(circle_at_15%_35%,hsl(var(--primary)/.08),transparent_30%)]" />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <a
            href="#top"
            className="group flex items-center gap-3"
            aria-label="Belentani Studio, inicio"
          >
            <span className="grid size-10 place-items-center rounded-full bg-foreground text-background transition-transform duration-200 group-hover:rotate-6">
              B
            </span>
            <span className="text-sm font-semibold tracking-[0.28em] uppercase">
              Belentani Studio
            </span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a
              href="#catalogo"
              className="transition-colors hover:text-foreground"
            >
              Catálogo
            </a>
            <a
              href="#recursos"
              className="transition-colors hover:text-foreground"
            >
              Recursos
            </a>
            <a
              href="#evolucion"
              className="transition-colors hover:text-foreground"
            >
              Evolución
            </a>
          </div>
          <Button asChild size="sm" className="rounded-full px-5">
            <a href="mailto:belentani7studio@proton.me">Contactar</a>
          </Button>
        </nav>

        <div
          id="top"
          className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:pb-32 lg:pt-28"
        >
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="mb-7 rounded-full border-primary/30 bg-primary/5 px-4 py-2 text-primary"
            >
              Estudio digital firmado por Pedro Belentani
            </Badge>
            <h1 className="text-balance text-5xl font-semibold leading-[.98] tracking-[-.06em] md:text-7xl lg:text-8xl">
              Hacer visible lo que importa.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
              Belentani Studio reúne percepción, estrategia, herramientas e
              inteligencia para construir una presencia digital que entiende,
              acompaña y evoluciona.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <a href="#catalogo">
                  Explorar el catálogo <ArrowUpRight className="ml-2 size-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-6"
              >
                <a href="#agente">
                  <Bot className="mr-2 size-4" /> Hablar con el agente
                </a>
              </Button>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              belentani.eu · noiacore.com · @belentani_
            </p>
          </div>
          <div className="relative flex min-h-[360px] items-end justify-end">
            <div className="absolute right-6 top-0 size-56 rounded-full border border-foreground/15" />
            <div className="absolute right-20 top-14 size-40 rounded-full border border-primary/30" />
            <div className="noiacore-glass relative max-w-sm rounded-[2rem] border border-border/70 bg-card/75 p-7 shadow-2xl shadow-primary/10 backdrop-blur">
              <div className="mb-14 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[.24em] text-muted-foreground">
                  Principio 01
                </span>
                <span className="size-3 rounded-full bg-primary" />
              </div>
              <p className="text-3xl font-medium leading-tight tracking-[-.04em]">
                La forma también piensa.
              </p>
              <div className="mt-12 flex items-center justify-between text-sm text-muted-foreground">
                <span>Gestalt / proximidad</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-16 md:grid-cols-3 lg:px-10">
        {pillars.map(({ icon: Icon, label, text }) => (
          <Card key={label} className="border-border/60 bg-card/60 shadow-none">
            <CardHeader>
              <Icon className="mb-6 size-5 text-primary" />
              <CardTitle className="text-xl">{label}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              {text}
            </CardContent>
          </Card>
        ))}
      </section>

      <section
        id="catalogo"
        className="mx-auto max-w-7xl scroll-mt-10 px-6 py-20 lg:px-10"
      >
        <div className="flex flex-col justify-between gap-5 border-b border-border pb-8 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-medium text-primary">
              01 / Catálogo vivo
            </p>
            <h2 className="text-4xl font-semibold tracking-[-.05em] md:text-6xl">
              Más de 3000 caminos.
            </h2>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/catalogo">
              <Search className="mr-2 size-4" /> Ver catálogo
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featured.map((item, index) => (
            <Card
              key={item.title}
              className="group min-h-64 overflow-hidden border-border/60 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/40"
            >
              <CardHeader>
                <div className="flex items-center justify-between text-xs uppercase tracking-[.2em] text-muted-foreground">
                  <span>{item.category}</span>
                  <span>0{index + 1}</span>
                </div>
                <CardTitle className="mt-10 text-2xl tracking-[-.04em]">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between text-sm leading-6 text-muted-foreground">
                {item.text}
                <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="recursos"
        className="border-y border-border/60 bg-muted/30 px-6 py-20 lg:px-10"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-medium text-primary">
              02 / Recursos multimedia
            </p>
            <h2 className="text-4xl font-semibold tracking-[-.05em] md:text-6xl">
              Escuchar también es comprender.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/60">
              <CardContent className="flex items-center gap-4 p-6">
                <span className="grid size-12 place-items-center rounded-full bg-foreground text-background">
                  <Play className="size-4 fill-current" />
                </span>
                <div>
                  <p className="font-medium">Vídeos de estudio</p>
                  <p className="text-sm text-muted-foreground">
                    Reproducción ligera y consciente.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="flex items-center gap-4 p-6">
                <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Mail className="size-4" />
                </span>
                <div>
                  <p className="font-medium">Voces y conversaciones</p>
                  <p className="text-sm text-muted-foreground">
                    Material sonoro con contexto.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="agente"
        className="mx-auto max-w-7xl scroll-mt-10 px-6 py-20 lg:px-10"
      >
        <div className="rounded-[2rem] bg-foreground p-8 text-background md:p-14">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium text-primary-foreground/70">
              03 / Agente de marca
            </p>
            <h2 className="text-4xl font-semibold tracking-[-.05em] md:text-6xl">
              Una conversación con criterio.
            </h2>
            <p className="mt-6 text-lg leading-8 text-background/65">
              El agente Belentani Studio está diseñado para orientar, clasificar
              y crear sin perder contexto, tono ni límites. La respuesta
              automática nunca sustituye la responsabilidad humana en decisiones
              sensibles.
            </p>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="mt-8 rounded-full"
            >
              <Link href="/agente">
                <Bot className="mr-2 size-4" /> Abrir agente
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="evolucion"
        className="border-t border-border/60 px-6 py-10 lg:px-10"
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm text-muted-foreground md:flex-row">
          <span>© 2026 Belentani Studio · Pedro Belentani</span>
          <div className="flex gap-5">
            <a
              className="hover:text-foreground"
              href="https://belentani.eu"
              target="_blank"
              rel="noreferrer"
            >
              belentani.eu
            </a>
            <a
              className="hover:text-foreground"
              href="https://noiacore.com"
              target="_blank"
              rel="noreferrer"
            >
              noiacore.com
            </a>
            <a
              className="hover:text-foreground"
              href="mailto:belentani7studio@proton.me"
            >
              Correo
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
