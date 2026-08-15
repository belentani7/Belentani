import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Filter,
  Loader2,
  RefreshCcw,
  Search,
} from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

export default function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<"recent" | "name">("recent");
  const [page, setPage] = useState(1);
  const input = useMemo(
    () => ({ query, category, tag, sort, page, pageSize: 24 }),
    [query, category, tag, sort, page]
  );
  const catalog = trpc.catalog.list.useQuery(input, {
    placeholderData: previous => previous,
  });
  const items = catalog.data?.items ?? [];
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
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="max-w-3xl">
          <Badge variant="outline" className="rounded-full">
            Catálogo vivo
          </Badge>
          <h1 className="mt-6 text-5xl font-semibold tracking-[-.06em] md:text-7xl">
            Más de 3000 recursos para avanzar con criterio.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Explora herramientas, métodos y referencias organizadas para que
            encontrar algo útil sea también una forma de pensar.
          </p>
        </div>
        <div className="mt-12 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setPage(1);
              }}
              className="h-12 rounded-full pl-11"
              placeholder="Buscar por nombre, categoría o descripción"
              aria-label="Buscar en el catálogo"
            />
          </div>
          <select
            value={category}
            onChange={event => {
              setCategory(event.target.value);
              setPage(1);
            }}
            className="h-12 rounded-full border border-input bg-background px-5 text-sm"
            aria-label="Filtrar por categoría"
          >
            <option value="all">Todas las categorías</option>
            {catalog.data?.categories.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Input
            value={tag}
            onChange={event => {
              setTag(event.target.value);
              setPage(1);
            }}
            className="h-12 rounded-full lg:w-48"
            placeholder="Etiqueta"
            aria-label="Filtrar por etiqueta"
          />
          <select
            value={sort}
            onChange={event => {
              setSort(event.target.value as "recent" | "name");
              setPage(1);
            }}
            className="h-12 rounded-full border border-input bg-background px-5 text-sm"
            aria-label="Ordenar resultados"
          >
            <option value="recent">Más recientes</option>
            <option value="name">Nombre A–Z</option>
          </select>
          <Button variant="outline" className="h-12 rounded-full">
            <Filter className="mr-2 size-4" /> Filtros activos
          </Button>
        </div>
        {catalog.isLoading && (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-2xl bg-muted"
                aria-label="Cargando recurso"
              />
            ))}
          </div>
        )}
        {catalog.isError && (
          <Card className="mt-12 border-destructive/40">
            <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
              <p className="font-medium">No se pudo cargar el catálogo.</p>
              <p className="text-sm text-muted-foreground">
                Comprueba la conexión y vuelve a intentarlo.
              </p>
              <Button
                onClick={() => void catalog.refetch()}
                variant="outline"
                className="rounded-full"
              >
                <RefreshCcw className="mr-2 size-4" /> Reintentar
              </Button>
            </CardContent>
          </Card>
        )}
        {!catalog.isLoading && !catalog.isError && items.length === 0 && (
          <Card className="mt-12 border-dashed">
            <CardContent className="p-12 text-center">
              <p className="font-medium">
                Todavía no hay recursos publicados para este criterio.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                El panel de administración permitirá publicar entradas
                verificadas sin inventar información.
              </p>
            </CardContent>
          </Card>
        )}
        {!catalog.isLoading && !catalog.isError && items.length > 0 && (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map(item => (
              <Card
                key={item.id}
                className="border-border/60 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40"
              >
                <CardHeader>
                  <Badge variant="secondary" className="w-fit rounded-full">
                    {item.category}
                  </Badge>
                  <CardTitle className="pt-3 text-2xl tracking-[-.04em]">
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-muted-foreground">
                  <p>{item.description}</p>
                  {item.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.split(",").map(label => (
                        <Badge
                          key={label}
                          variant="outline"
                          className="rounded-full"
                        >
                          {label.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!catalog.isLoading && !catalog.isError && (
          <div className="mt-12 flex items-center justify-between border-t border-border pt-6 text-sm text-muted-foreground">
            <span>
              {catalog.data?.total ?? 0} resultados · Página {page}
            </span>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                disabled={page <= 1 || catalog.isFetching}
                onClick={() => setPage(value => value - 1)}
                aria-label="Página anterior"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                disabled={items.length < input.pageSize || catalog.isFetching}
                onClick={() => setPage(value => value + 1)}
                aria-label="Página siguiente"
              >
                {catalog.isFetching ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
