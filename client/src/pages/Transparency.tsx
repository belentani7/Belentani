import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackBusinessEvent } from "@/lib/analytics";
import { trpc } from "@/lib/trpc";

export default function Transparency() {
  const recordEvent = trpc.metrics.recordBusinessEvent.useMutation();
  useEffect(() => {
    trackBusinessEvent("transparency_opened", {}, event =>
      recordEvent.mutate({ event })
    );
  }, []);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 lg:px-10">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[.24em]"
          >
            Belentani Studio
          </Link>
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" /> Inicio
            </Link>
          </Button>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">
          Transparencia
        </p>
        <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-[-.06em] md:text-7xl">
          Criterio antes que comisión.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Belentani Studio, firmado por Pedro Belentani, puede incluir enlaces
          de afiliación, patrocinios, donaciones o servicios profesionales.
          Cuando exista una relación comercial, se indicará de forma visible.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Card className="border-border/60">
            <CardHeader>
              <ShieldCheck className="size-5 text-primary" />
              <CardTitle>Cómo se selecciona</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              Las herramientas se organizan por utilidad, contexto,
              accesibilidad, documentación, mantenimiento y adecuación al caso
              de uso. La existencia de una comisión no convierte una herramienta
              en recomendación automática.
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Alternativas y control</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              Cuando sea posible, se mostrarán alternativas gratuitas o de
              código abierto. Las fuentes, la fecha de comprobación y el estado
              editorial forman parte de la ficha del recurso.
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Contenido generado con IA</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              La IA puede ayudar a clasificar, resumir o preparar borradores.
              Las comunicaciones sensibles y las publicaciones importadas
              requieren revisión humana y no se presentan como experiencia
              personal si no existe evidencia.
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Contacto</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              Para preguntas sobre una recomendación o relación comercial,
              escribe a{" "}
              <a
                onClick={() =>
                  trackBusinessEvent("contact_clicked", {}, event =>
                    recordEvent.mutate({ event })
                  )
                }
                className="text-primary underline"
                href="mailto:belentani7studio@proton.me"
              >
                belentani7studio@proton.me
              </a>
              .
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
