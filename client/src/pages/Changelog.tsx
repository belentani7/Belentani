import { Link } from "wouter";
import { ArrowLeft, CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function Changelog() {
  const { data, isLoading, isError } = trpc.changelog.list.useQuery();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[.24em] uppercase"
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
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-medium text-primary">Evolución pública</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-.06em] md:text-7xl">
          Lo que cambia, queda visible.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Este registro muestra cómo Belentani Studio aprende, mejora y conserva
          sus decisiones.
        </p>
        <div className="mt-12 space-y-5">
          {isLoading && (
            <Card>
              <CardContent className="p-8 text-muted-foreground">
                Cargando evolución...
              </CardContent>
            </Card>
          )}
          {isError && (
            <Card>
              <CardContent className="p-8 text-muted-foreground">
                No se pudo cargar el changelog. Puedes reintentar más tarde.
              </CardContent>
            </Card>
          )}
          {!isLoading && !isError && (!data || data.length === 0) && (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <Sparkles className="mx-auto size-6 text-primary" />
                <p className="mt-4 font-medium">
                  La primera mejora documentada está en preparación.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  El registro público se activará cuando exista una entrada
                  publicada.
                </p>
              </CardContent>
            </Card>
          )}
          {data?.map(entry => (
            <Card key={entry.id} className="border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-muted-foreground">
                  <CalendarDays className="size-4" />{" "}
                  {entry.publishedAt
                    ? new Date(entry.publishedAt).toLocaleDateString()
                    : "Fecha pendiente"}
                </div>
                <CardTitle className="text-2xl">{entry.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{entry.summary}</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                  {entry.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
