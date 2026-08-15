import { useEffect, useRef, useState } from "react";
import { ArrowLeft, FileText, Headphones, Video } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

const iconFor = {
  video: Video,
  audio: Headphones,
  voice: Headphones,
  document: FileText,
} as const;
function LazyMedia({
  kind,
  src,
}: {
  kind: "video" | "audio" | "voice";
  src: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={containerRef} className="mt-6 min-h-12">
      {visible ? (
        kind === "video" ? (
          <video
            controls
            preload="metadata"
            className="w-full rounded-xl"
            src={src}
          />
        ) : (
          <audio controls preload="metadata" className="w-full" src={src} />
        )
      ) : (
        <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
          Reproductor preparado; se cargará al acercarse.
        </p>
      )}
    </div>
  );
}

export default function Resources() {
  const { data, isLoading, isError, refetch } = trpc.media.list.useQuery();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
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
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <Badge variant="outline" className="rounded-full">
          Biblioteca multimedia
        </Badge>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-.06em] md:text-7xl">
          Escuchar también es comprender.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Vídeos, voces, documentos y materiales de estudio con carga diferida
          para respetar el ritmo de cada dispositivo.
        </p>
        {isLoading && (
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
          </div>
        )}
        {isError && (
          <Card className="mt-12">
            <CardContent className="p-10 text-center">
              <p>No se pudo cargar la biblioteca.</p>
              <Button
                onClick={() => void refetch()}
                className="mt-5 rounded-full"
              >
                Reintentar
              </Button>
            </CardContent>
          </Card>
        )}
        {!isLoading && !isError && (!data || data.length === 0) && (
          <Card className="mt-12 border-dashed">
            <CardContent className="p-12 text-center">
              <p className="font-medium">
                La biblioteca está preparada para recibir recursos verificados.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                No se muestran archivos inventados ni activos multimedia sin
                fuente.
              </p>
            </CardContent>
          </Card>
        )}
        {!isLoading && !isError && data && data.length > 0 && (
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {data.map(resource => {
              const Icon = iconFor[resource.kind];
              return (
                <Card
                  key={resource.id}
                  className="overflow-hidden border-border/60"
                >
                  <CardHeader>
                    <Icon className="size-5 text-primary" />
                    <Badge
                      variant="secondary"
                      className="mt-5 w-fit rounded-full"
                    >
                      {resource.kind}
                    </Badge>
                    <CardTitle className="text-2xl">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {resource.description}
                    </p>
                    {resource.kind === "video" ||
                    resource.kind === "audio" ||
                    resource.kind === "voice" ? (
                      <LazyMedia
                        kind={resource.kind}
                        src={resource.publicUrl}
                      />
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
