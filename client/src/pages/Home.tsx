import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowRight, Database, LockKeyhole, ShieldCheck, Terminal, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";

const gridStyle = {
  backgroundImage: "linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

function Metric({ label, value, tone = "text-white" }: { label: string; value: string | number; tone?: string }) {
  return <div className="border border-white/15 bg-[#0a2370]/80 p-4"><p className="text-[10px] uppercase tracking-[.24em] text-blue-200/70">{label}</p><p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p></div>;
}

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const tenantsQuery = trpc.pvcu.tenants.useQuery(undefined, { enabled: isAuthenticated });
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const tenantKey = selectedTenant ?? tenantsQuery.data?.[0]?.tenantKey ?? null;
  const overviewQuery = trpc.pvcu.overview.useQuery({ tenantKey: tenantKey ?? "__none__" }, { enabled: Boolean(tenantKey && isAuthenticated) });
  const selected = useMemo(() => tenantsQuery.data?.find((tenant) => tenant.tenantKey === tenantKey), [tenantsQuery.data, tenantKey]);

  if (loading) return <div className="min-h-screen bg-[#071b59] p-8 text-white">Loading kernel...</div>;

  return (
    <div className="min-h-screen bg-[#071b59] text-white" style={gridStyle}>
      <header className="border-b border-white/20 bg-[#06184f]/95 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[.32em] text-blue-200">PAEA / SUPRA-KERNEL</p><h1 className="mt-2 text-2xl font-bold tracking-tight">Universal Control Plane</h1></div>
          <div className="flex items-center gap-3"><Badge className="rounded-none border border-emerald-300/40 bg-emerald-400/10 text-emerald-200">{isAuthenticated ? "SESSION ACTIVE" : "READ-ONLY"}</Badge><span className="hidden text-xs text-blue-100/70 md:inline">{user?.name ?? "Operator console"}</span></div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <Card className="rounded-none border-white/20 bg-[#082064]/85 text-white shadow-2xl shadow-blue-950/40"><CardHeader><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.25em] text-blue-200/70">PVC-U / L0–L8</p><CardTitle className="mt-2 text-xl">Policy Validation Control Unit</CardTitle></div><ShieldCheck className="text-cyan-200" /></div></CardHeader><CardContent><p className="max-w-2xl text-sm leading-6 text-blue-100/80">Capa transversal para validar entradas, acciones, efectos externos y respuestas de agentes con riesgo proporcional, evidencia hashada y aislamiento por tenant.</p><div className="mt-5 flex flex-wrap gap-3"><Badge variant="outline" className="rounded-none border-white/25 text-blue-100">FAIL-SAFE</Badge><Badge variant="outline" className="rounded-none border-white/25 text-blue-100">EVIDENCE-FIRST</Badge><Badge variant="outline" className="rounded-none border-white/25 text-blue-100">TENANT-SCOPED</Badge></div></CardContent></Card>
          <Card className="rounded-none border-white/20 bg-[#091c5a]/90 text-white"><CardHeader><CardTitle className="flex items-center gap-2 text-sm uppercase tracking-[.18em]"><Terminal size={16} /> Runtime status</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex items-center justify-between border-b border-white/10 pb-3"><span className="text-blue-100/70">Persistence</span><span className="text-emerald-200">{overviewQuery.isFetching ? "SYNCING" : "READY"}</span></div><div className="flex items-center justify-between border-b border-white/10 pb-3"><span className="text-blue-100/70">Evidence policy</span><span className="text-cyan-200">DIGEST ONLY</span></div><div className="flex items-center justify-between"><span className="text-blue-100/70">Operator</span><span>{user?.role ?? "guest"}</span></div></CardContent></Card>
        </section>

        {!isAuthenticated ? <Card className="rounded-none border-amber-300/30 bg-amber-300/10 text-amber-50"><CardContent className="flex items-center gap-3 p-5"><TriangleAlert size={18} /><p className="text-sm">Inicia sesión para consultar tenants y operar validaciones PVC-U. El panel permanece en modo de lectura sin sesión.</p></CardContent></Card> : null}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Tenants visibles" value={tenantsQuery.data?.length ?? 0} /><Metric label="Validaciones" value={overviewQuery.data?.metrics.validationCount ?? 0} /><Metric label="Aprobadas" value={`${overviewQuery.data?.metrics.approvalRate ?? 0}%`} tone="text-emerald-200" /><Metric label="Bloqueadas / cuarentena" value={overviewQuery.data?.metrics.blocked ?? 0} tone="text-amber-200" /></section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Card className="rounded-none border-white/20 bg-[#082064]/85 text-white"><CardHeader><CardTitle className="flex items-center gap-2 text-sm uppercase tracking-[.18em]"><LockKeyhole size={16} /> Tenant scope</CardTitle></CardHeader><CardContent className="space-y-3"><select aria-label="Tenant scope" value={tenantKey ?? ""} onChange={(event) => setSelectedTenant(event.target.value || null)} className="w-full border border-white/20 bg-[#06184f] px-3 py-3 text-sm text-white outline-none focus:border-cyan-200" disabled={!tenantsQuery.data?.length}><option value="">{tenantsQuery.isLoading ? "Cargando scopes..." : "Selecciona un tenant"}</option>{tenantsQuery.data?.map((tenant) => <option key={tenant.tenantKey} value={tenant.tenantKey}>{tenant.name} · {tenant.tier}</option>)}</select>{selected ? <div className="grid grid-cols-2 gap-3 text-xs"><div className="border border-white/10 p-3"><p className="text-blue-200/60">KEY</p><p className="mt-1 font-mono">{selected.tenantKey}</p></div><div className="border border-white/10 p-3"><p className="text-blue-200/60">STATUS</p><p className="mt-1 text-emerald-200">{selected.status}</p></div></div> : <p className="text-sm text-blue-100/60">No hay tenants visibles en este scope.</p>}</CardContent></Card>

          <Card className="rounded-none border-white/20 bg-[#082064]/85 text-white"><CardHeader><CardTitle className="flex items-center gap-2 text-sm uppercase tracking-[.18em]"><Activity size={16} /> Validation ledger</CardTitle></CardHeader><CardContent>{overviewQuery.data?.validations?.length ? <div className="space-y-2">{overviewQuery.data.validations.slice(0, 6).map((validation) => <div key={validation.validationId} className="flex items-center justify-between gap-3 border border-white/10 px-3 py-3 text-xs"><div className="min-w-0"><p className="truncate font-mono text-blue-100">{validation.validationId}</p><p className="mt-1 text-blue-200/55">{validation.artifactType} · {validation.riskClass}</p></div><Badge className="rounded-none border border-white/20 bg-transparent text-[10px] text-cyan-100">{validation.status}</Badge></div>)}</div> : <div className="flex items-center gap-3 py-8 text-sm text-blue-100/60"><Database size={18} /> Aún no existen ejecuciones para este tenant.</div>}</CardContent></Card>
        </section>

        <footer className="flex flex-col justify-between gap-3 border-t border-white/15 pt-5 text-xs text-blue-100/55 md:flex-row"><span>PVC-U DB v1 · tenantKey + ownerOpenId scope · evidenceHash</span><span className="flex items-center gap-2">Inspect controls <ArrowRight size={14} /></span></footer>
      </main>
    </div>
  );
}
