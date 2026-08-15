import { useState } from "react";
import {
  Activity,
  Archive,
  ArrowLeft,
  Pause,
  Play,
  Check,
  CircleAlert,
  Clock3,
  Database,
  FileText,
  History,
  LockKeyhole,
  Plus,
  X,
  Save,
  Settings2,
  Upload,
  Zap,
  Workflow,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const trpcUtils = trpc.useUtils();
  const [preflightMessage, setPreflightMessage] = useState<string | null>(null);
  const [selectedAuditDraftId, setSelectedAuditDraftId] = useState<
    number | null
  >(null);
  const summary = trpc.admin.summary.useQuery(undefined, {
    enabled: Boolean(isAuthenticated),
  });
  const createCatalog = trpc.admin.catalogCreate.useMutation({
    onSuccess: () => {
      void summary.refetch();
      setCatalog({
        name: "",
        category: "",
        description: "",
        url: "",
        tags: "",
      });
    },
  });
  const saveTemplate = trpc.admin.templateUpsert.useMutation();
  const ingestSource = trpc.admin.ingestSource.useMutation();
  const reviewQueue = trpc.admin.catalogReviewQueue.useQuery(undefined, {
    enabled: Boolean(isAuthenticated),
  });
  const reviewCatalog = trpc.admin.catalogReview.useMutation({
    onSuccess: () => void reviewQueue.refetch(),
  });
  const mediaAdminList = trpc.admin.mediaAdminList.useQuery(undefined, {
    enabled: Boolean(isAuthenticated),
  });
  const setMediaStatus = trpc.admin.mediaSetStatus.useMutation({
    onSuccess: () => void mediaAdminList.refetch(),
  });
  const changelogAdmin = trpc.admin.changelogAdmin.useQuery(undefined, {
    enabled: Boolean(isAuthenticated),
  });
  const saveChangelog = trpc.admin.changelogUpsert.useMutation({
    onSuccess: () => void changelogAdmin.refetch(),
  });
  const automations = trpc.admin.automations.useQuery(undefined, {
    enabled: Boolean(isAuthenticated),
  });
  const automationRuns = trpc.admin.automationRuns.useQuery(undefined, {
    enabled: Boolean(isAuthenticated),
  });
  const setAutomationStatus = trpc.admin.automationSetStatus.useMutation({
    onSuccess: () => void automations.refetch(),
  });
  const drafts = trpc.admin.emailDrafts.useQuery(undefined, {
    enabled: Boolean(isAuthenticated),
  });
  const draftAudit = trpc.admin.emailDraftAudit.useQuery(
    { draftId: selectedAuditDraftId ?? 0 },
    { enabled: Boolean(isAuthenticated && selectedAuditDraftId) }
  );
  const businessMetrics = trpc.metrics.public.useQuery(undefined, {
    enabled: Boolean(isAuthenticated),
  });
  const auditLog = trpc.admin.auditLog.useQuery(undefined, {
    enabled: Boolean(isAuthenticated),
  });
  const reviewDraft = trpc.admin.emailDraftReview.useMutation({
    onSuccess: () => void drafts.refetch(),
  });
  const [catalog, setCatalog] = useState({
    name: "",
    category: "",
    description: "",
    url: "",
    tags: "",
  });
  const [source, setSource] = useState({
    sourceName: "sindresorhus/awesome",
    sourceUrl:
      "https://raw.githubusercontent.com/sindresorhus/awesome/main/readme.md",
    category: "Tools",
    license: "CC0-1.0",
  });
  const [template, setTemplate] = useState({
    key: "contact-auto-reply",
    subject: "Gracias por escribir a Belentani Studio",
    body: "Hola {{name}},\n\nHemos recibido tu mensaje. Lo revisaremos con atención humana.",
    status: "draft" as const,
  });
  const [changelog, setChangelog] = useState({
    slug: "",
    title: "",
    summary: "",
    body: "",
  });
  if (loading)
    return (
      <main className="grid min-h-screen place-items-center">
        Cargando acceso...
      </main>
    );
  if (!isAuthenticated || !user)
    return (
      <main className="grid min-h-screen place-items-center bg-muted/20 px-6">
        <Card className="max-w-md">
          <CardHeader>
            <LockKeyhole className="size-6 text-primary" />
            <CardTitle>Área privada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-muted-foreground">
              El panel de gestión requiere una sesión autorizada.
            </p>
            <Button onClick={startLogin} className="mt-6 rounded-full">
              Iniciar sesión
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  return (
    <main className="min-h-screen bg-muted/20">
      <header className="border-b border-border/60 bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[.2em] text-primary">
              Belentani Studio
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-.04em]">
              Centro de gestión
            </h1>
          </div>
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" /> Sitio público
            </Link>
          </Button>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="outline" className="rounded-full">
              Sesión autorizada
            </Badge>
            <p className="mt-4 text-sm text-muted-foreground">
              {user.email ?? user.name ?? "Usuario"} · rol {user.role}
            </p>
          </div>
          <Button variant="outline" className="rounded-full">
            <Settings2 className="mr-2 size-4" /> Configuración
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Metric
            icon={Database}
            label="Catálogo"
            value={summary.data?.catalog ?? "—"}
          />
          <Metric
            icon={Workflow}
            label="Automatizaciones"
            value={summary.data?.automations ?? "—"}
          />
          <Metric
            icon={FileText}
            label="Plantillas de correo"
            value={summary.data?.templates ?? "—"}
          />
        </div>
        <Card className="mt-8 border-border/60">
          <CardHeader>
            <CardTitle className="text-xl">Embudo público agregado</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(businessMetrics.data?.businessEvents ?? {}).map(
              ([event, value]) => (
                <div key={event} className="rounded-xl bg-muted/50 p-4">
                  <p className="text-xs uppercase tracking-[.12em] text-muted-foreground">
                    {event.replaceAll("_", " ")}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                </div>
              )
            )}
            {!businessMetrics.data && (
              <p className="text-sm text-muted-foreground">
                Cargando métricas agregadas...
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="mt-8 border-border/60">
          <CardHeader>
            <CardTitle className="text-xl">Rendimiento y operación</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Metric
              icon={Activity}
              label="Requests"
              value={businessMetrics.data?.requests ?? "—"}
            />
            <Metric
              icon={Clock3}
              label="Latencia media agente"
              value={`${businessMetrics.data?.averageAgentLatencyMs ?? "—"} ms`}
            />
            <Metric
              icon={CircleAlert}
              label="Fallbacks agente"
              value={businessMetrics.data?.agentFallbacks ?? "—"}
            />
            <Metric
              icon={Zap}
              label="Jobs correctos"
              value={businessMetrics.data?.scheduledSuccess ?? "—"}
            />
            <Metric
              icon={CircleAlert}
              label="Jobs fallidos"
              value={businessMetrics.data?.scheduledFailures ?? "—"}
            />
          </CardContent>
        </Card>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                Nueva herramienta <Plus className="size-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Nombre"
                value={catalog.name}
                onChange={e => setCatalog({ ...catalog, name: e.target.value })}
              />
              <Input
                placeholder="Categoría"
                value={catalog.category}
                onChange={e =>
                  setCatalog({ ...catalog, category: e.target.value })
                }
              />
              <Textarea
                placeholder="Descripción verificable"
                value={catalog.description}
                onChange={e =>
                  setCatalog({ ...catalog, description: e.target.value })
                }
              />
              <Input
                placeholder="URL opcional"
                value={catalog.url}
                onChange={e => setCatalog({ ...catalog, url: e.target.value })}
              />
              <Input
                placeholder="Etiquetas separadas por comas"
                value={catalog.tags}
                onChange={e => setCatalog({ ...catalog, tags: e.target.value })}
              />
              <Button
                className="rounded-full"
                disabled={
                  createCatalog.isPending ||
                  !catalog.name ||
                  !catalog.category ||
                  !catalog.description
                }
                onClick={() =>
                  createCatalog.mutate({
                    ...catalog,
                    url: catalog.url || undefined,
                    status: "draft",
                  })
                }
              >
                <Plus className="mr-2 size-4" /> Guardar como borrador
              </Button>
              {createCatalog.isSuccess && (
                <p className="text-sm text-primary">
                  Borrador guardado y listo para revisión.
                </p>
              )}
              {createCatalog.isError && (
                <p className="text-sm text-destructive">
                  No se pudo guardar el borrador.
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                Plantilla de correo <Save className="size-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Clave de plantilla"
                value={template.key}
                onChange={e =>
                  setTemplate({ ...template, key: e.target.value })
                }
              />
              <Input
                placeholder="Asunto"
                value={template.subject}
                onChange={e =>
                  setTemplate({ ...template, subject: e.target.value })
                }
              />
              <Textarea
                className="min-h-44"
                placeholder="Cuerpo editable"
                value={template.body}
                onChange={e =>
                  setTemplate({ ...template, body: e.target.value })
                }
              />
              <Button
                variant="outline"
                className="rounded-full"
                disabled={saveTemplate.isPending}
                onClick={() => saveTemplate.mutate(template)}
              >
                <Save className="mr-2 size-4" /> Guardar plantilla
              </Button>
              {saveTemplate.isSuccess && (
                <p className="text-sm text-primary">
                  Plantilla guardada como borrador editable.
                </p>
              )}
              {saveTemplate.isError && (
                <p className="text-sm text-destructive">
                  No se pudo guardar la plantilla.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        <Card className="mt-8 border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-xl">
              Revisión editorial del catálogo{" "}
              <Badge variant="secondary">{reviewQueue.data?.length ?? 0}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!reviewQueue.data?.length && (
              <p className="text-sm leading-7 text-muted-foreground">
                No hay entradas pendientes de revisión editorial.
              </p>
            )}
            {reviewQueue.data?.map(item => (
              <div
                key={item.id}
                className="rounded-2xl border border-border/60 p-5"
              >
                <p className="font-medium">{item.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.sourceName ?? "fuente no indicada"} ·{" "}
                  {item.ingestedAt
                    ? new Date(item.ingestedAt).toLocaleString()
                    : "sin fecha"}{" "}
                  · estado {item.reviewStatus}
                </p>
                <p className="mt-2 break-all text-xs text-muted-foreground">
                  {item.canonicalUrl}
                </p>
                {item.quarantineReason && (
                  <p className="mt-2 text-sm text-destructive">
                    Cuarentena: {item.quarantineReason}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={reviewCatalog.isPending}
                    onClick={() =>
                      reviewCatalog.mutate({
                        id: item.id,
                        reviewStatus: "approved",
                        status: "published",
                      })
                    }
                  >
                    Aprobar y publicar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    disabled={reviewCatalog.isPending}
                    onClick={() =>
                      reviewCatalog.mutate({
                        id: item.id,
                        reviewStatus: "quarantined",
                      })
                    }
                  >
                    Mantener en cuarentena
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="mt-8 border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-xl">
              Importar fuente pública <Upload className="size-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-7 text-muted-foreground">
              La fuente se valida, deduplica y guarda como pendiente de
              revisión. Las entradas no aparecen públicamente hasta aprobación.
            </p>
            <Input
              placeholder="Nombre de fuente"
              value={source.sourceName}
              onChange={e =>
                setSource({ ...source, sourceName: e.target.value })
              }
            />
            <Input
              placeholder="URL Markdown allowlisted"
              value={source.sourceUrl}
              onChange={e =>
                setSource({ ...source, sourceUrl: e.target.value })
              }
            />
            <Input
              placeholder="Categoría"
              value={source.category}
              onChange={e => setSource({ ...source, category: e.target.value })}
            />
            <Input
              placeholder="Licencia declarada"
              value={source.license}
              onChange={e => setSource({ ...source, license: e.target.value })}
            />
            <Button
              variant="outline"
              className="rounded-full"
              disabled={ingestSource.isPending}
              onClick={() => ingestSource.mutate(source)}
            >
              Importar hasta 500 candidatos
            </Button>
            {ingestSource.data && (
              <p className="text-sm text-primary">
                Descubiertos: {ingestSource.data.discovered} · En cuarentena:{" "}
                {ingestSource.data.quarantined}
              </p>
            )}
            {ingestSource.isError && (
              <p className="text-sm text-destructive">
                No se pudo importar la fuente. Comprueba la URL y la allowlist.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="mt-8 border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-xl">
              Borradores de correo{" "}
              <Badge variant="secondary">{drafts.data?.length ?? 0}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!drafts.data?.length && (
              <p className="text-sm leading-7 text-muted-foreground">
                No hay borradores pendientes. El clasificador debe crear
                borradores desde una fuente de correo autorizada; esta interfaz
                nunca envía automáticamente.
              </p>
            )}
            {drafts.data?.map(draft => (
              <div
                key={draft.id}
                className="rounded-2xl border border-border/60 p-5"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row">
                  <div>
                    <p className="font-medium">{draft.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {draft.fromAddress} · {draft.category}
                    </p>
                  </div>
                  <Badge
                    variant={
                      draft.status === "approved" ? "default" : "outline"
                    }
                  >
                    {draft.status}
                  </Badge>
                </div>
                <Textarea
                  className="mt-4 min-h-32"
                  defaultValue={draft.draftBody}
                  aria-label={`Borrador para ${draft.subject}`}
                  onBlur={event => {
                    if (event.target.value !== draft.draftBody)
                      reviewDraft.mutate({
                        id: draft.id,
                        status: draft.status,
                        draftBody: event.target.value,
                      });
                  }}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                    aria-label={`Ver historial de ${draft.subject}`}
                    onClick={() => setSelectedAuditDraftId(draft.id)}
                  >
                    <History className="mr-2 size-4" /> Historial
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={reviewDraft.isPending}
                    onClick={() =>
                      reviewDraft.mutate({ id: draft.id, status: "approved" })
                    }
                  >
                    <Check className="mr-2 size-4" /> Aprobar para revisión
                    final
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    disabled={reviewDraft.isPending}
                    onClick={() =>
                      reviewDraft.mutate({ id: draft.id, status: "rejected" })
                    }
                  >
                    <X className="mr-2 size-4" /> Rechazar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                    disabled={reviewDraft.isPending}
                    onClick={() =>
                      reviewDraft.mutate({ id: draft.id, status: "archived" })
                    }
                  >
                    <Archive className="mr-2 size-4" /> Archivar
                  </Button>
                </div>
                {selectedAuditDraftId === draft.id && (
                  <div className="mt-4 rounded-xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-[.12em] text-muted-foreground">
                      Historial de cambios
                    </p>
                    <div className="mt-3 space-y-2 text-sm">
                      {!draftAudit.data?.length && (
                        <p className="text-muted-foreground">
                          Sin cambios registrados.
                        </p>
                      )}
                      {draftAudit.data?.map(entry => (
                        <div
                          key={entry.id}
                          className="flex flex-col justify-between gap-1 md:flex-row"
                        >
                          <span>
                            {entry.action} · {entry.previousStatus ?? "nuevo"} →{" "}
                            {entry.nextStatus}
                          </span>
                          <time className="text-muted-foreground">
                            {new Date(entry.occurredAt).toLocaleString()}
                          </time>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="mt-8 border-border/60">
          <CardHeader>
            <CardTitle className="text-xl">
              Automatizaciones controladas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!automations.data?.length && (
              <p className="text-sm leading-7 text-muted-foreground">
                No hay jobs configurados. La activación exige callback válido y
                task UID; los jobs se pueden pausar sin borrar su configuración.
              </p>
            )}
            {automations.data?.map(job => (
              <div
                key={job.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-border/60 p-5 md:flex-row md:items-center"
              >
                <div>
                  <p className="font-medium">{job.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.status} · {job.callbackPath} ·{" "}
                    {job.scheduleCronTaskUid ?? "sin task UID"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    disabled={setAutomationStatus.isPending}
                    onClick={() =>
                      setAutomationStatus.mutate({
                        id: job.id,
                        status: "paused",
                        callbackPath: "/api/scheduled/catalog-refresh",
                      })
                    }
                  >
                    <Pause className="mr-2 size-4" /> Pausar
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={setAutomationStatus.isPending}
                    onClick={async () => {
                      setPreflightMessage(null);
                      const result =
                        await trpcUtils.admin.automationPreflight.fetch({
                          id: job.id,
                          callbackPath: job.callbackPath,
                        });
                      if (!result.ready) {
                        setPreflightMessage(`No activado: ${result.reason}`);
                        return;
                      }
                      setPreflightMessage(
                        `Preflight correcto para ${job.name}`
                      );
                      setAutomationStatus.mutate({
                        id: job.id,
                        status: "active",
                        callbackPath: "/api/scheduled/catalog-refresh",
                      });
                    }}
                  >
                    <Play className="mr-2 size-4" /> Activar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="mt-8 border-border/60">
          <CardHeader>
            <CardTitle className="text-xl">Historial de ejecuciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!automationRuns.data?.length && (
              <p className="text-sm leading-7 text-muted-foreground">
                No hay ejecuciones registradas.
              </p>
            )}
            {automationRuns.data?.map(run => (
              <div
                key={run.id}
                className="flex flex-col justify-between gap-2 rounded-xl border border-border/60 p-4 text-sm md:flex-row"
              >
                <span>
                  {run.status} · {run.taskUid ?? "sin task UID"}
                </span>
                <span className="text-muted-foreground">
                  {run.durationMs ?? 0} ms ·{" "}
                  {new Date(run.startedAt).toLocaleString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        {preflightMessage && (
          <p className="mt-3 text-sm text-muted-foreground">
            {preflightMessage}
          </p>
        )}
        <Card className="mt-8 border-border/60">
          <CardHeader>
            <CardTitle className="text-xl">Recursos multimedia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!mediaAdminList.data?.length && (
              <p className="text-sm text-muted-foreground">
                No hay recursos multimedia registrados.
              </p>
            )}
            {mediaAdminList.data?.map(resource => (
              <div
                key={resource.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-border/60 p-4 md:flex-row md:items-center"
              >
                <span className="text-sm">
                  {resource.title} · {resource.status}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() =>
                      setMediaStatus.mutate({
                        id: resource.id,
                        status: "published",
                      })
                    }
                  >
                    Publicar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() =>
                      setMediaStatus.mutate({
                        id: resource.id,
                        status: "archived",
                      })
                    }
                  >
                    Archivar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="mt-8 border-border/60">
          <CardHeader>
            <CardTitle className="text-xl">Contenido editorial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Slug"
              value={changelog.slug}
              onChange={event =>
                setChangelog(current => ({
                  ...current,
                  slug: event.target.value,
                }))
              }
            />
            <Input
              placeholder="Título"
              value={changelog.title}
              onChange={event =>
                setChangelog(current => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />
            <Input
              placeholder="Resumen"
              value={changelog.summary}
              onChange={event =>
                setChangelog(current => ({
                  ...current,
                  summary: event.target.value,
                }))
              }
            />
            <Textarea
              placeholder="Contenido"
              value={changelog.body}
              onChange={event =>
                setChangelog(current => ({
                  ...current,
                  body: event.target.value,
                }))
              }
            />
            <Button
              className="rounded-full"
              disabled={saveChangelog.isPending}
              onClick={() => saveChangelog.mutate(changelog)}
            >
              <Save className="mr-2 size-4" /> Guardar contenido
            </Button>
            {changelogAdmin.data?.map(entry => (
              <p key={entry.id} className="text-sm text-muted-foreground">
                {entry.title} · {entry.publishedAt ? "publicado" : "borrador"}
              </p>
            ))}
          </CardContent>
        </Card>
        <Card className="mt-8 border-border/60">
          <CardHeader>
            <CardTitle className="text-xl">Auditoría administrativa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!auditLog.data?.length && (
              <p className="text-sm text-muted-foreground">
                No hay acciones auditadas.
              </p>
            )}
            {auditLog.data?.slice(0, 20).map(entry => (
              <div
                key={entry.id}
                className="flex flex-col justify-between gap-1 rounded-xl border border-border/60 p-4 text-sm md:flex-row"
              >
                <span>
                  {entry.action} · {entry.entityType} · {entry.outcome}
                </span>
                <time className="text-muted-foreground">
                  {new Date(entry.occurredAt).toLocaleString()}
                </time>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="mt-8 border-border/60">
          <CardHeader>
            <CardTitle className="text-xl">Gobernanza operativa</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm leading-7 text-muted-foreground md:grid-cols-3">
            <p>
              Los cambios de contenido se registran y pueden revisarse antes de
              publicar.
            </p>
            <p>
              Las automatizaciones deben ser idempotentes y trazables por
              identificador de tarea.
            </p>
            <p>
              Las respuestas externas de correo requieren revisión humana
              mientras no exista una política explícita.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: number | string;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-6">
        <Icon className="size-5 text-primary" />
        <p className="mt-8 text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-4xl font-semibold tracking-[-.06em]">{value}</p>
      </CardContent>
    </Card>
  );
}
