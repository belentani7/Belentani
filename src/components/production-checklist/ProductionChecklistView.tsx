import React, { useState, useMemo } from 'react';
import { ChecklistCriterion, Language } from '../../types';
import { translations } from '../../locales/i18n';
import { 
  CheckCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Filter, 
  Download, 
  RotateCcw, 
  CheckCheck,
  Search,
  ExternalLink,
  Award,
  Layers
} from 'lucide-react';

interface Props {
  lang: Language;
}

const CRITERIA_DATA: ChecklistCriterion[] = [
  { id: 1, category: 'Repo & Git', name: 'origin remoto → GitHub belentani7/<repo>', verification: 'git remote -v', severity: 'Crítico', level: 0, completed: true },
  { id: 2, category: 'Repo & Git', name: 'Branch main protegida (PR required, status checks)', verification: 'GitHub Branch Protection', severity: 'Crítico', level: 1, completed: true },
  { id: 3, category: 'Repo & Git', name: 'Commits convencionales (feat:, fix:, chore:, docs:)', verification: 'git log --oneline', severity: 'Alto', level: 1, completed: true },
  { id: 4, category: 'Repo & Git', name: '.gitignore completo (node_modules, .env, dist, *.log)', verification: 'cat .gitignore', severity: 'Crítico', level: 0, completed: true },
  
  { id: 5, category: 'Seguridad', name: 'Cero secretos en repo (keys, tokens, passwords)', verification: 'git log --all --full-history -- **/.env* = vacío', severity: 'Crítico', level: 0, completed: true },
  { id: 6, category: 'Seguridad', name: 'Dependabot / Renovate activado', verification: 'GitHub Security tab', severity: 'Alto', level: 1, completed: true },
  { id: 7, category: 'Seguridad', name: 'CodeQL / Code scanning activado', verification: 'GitHub Security tab', severity: 'Alto', level: 2, completed: false },
  { id: 8, category: 'Seguridad', name: 'package-lock.json commiteado', verification: 'ls -la *lock*', severity: 'Medio', level: 1, completed: true },

  { id: 9, category: 'Build', name: 'package.json con scripts: build, dev, start, test, lint', verification: 'cat package.json | jq .scripts', severity: 'Crítico', level: 0, completed: true },
  { id: 10, category: 'Build', name: 'Build local pasa sin errores (npm run build)', verification: 'Exit code 0', severity: 'Crítico', level: 0, completed: true },
  { id: 11, category: 'Build', name: 'TypeScript strict mode ("strict": true)', verification: 'cat tsconfig.json | jq .compilerOptions.strict', severity: 'Alto', level: 1, completed: true },
  { id: 12, category: 'Build', name: 'Lint pasa (npm run lint)', verification: 'Exit code 0', severity: 'Alto', level: 1, completed: true },

  { id: 13, category: 'Tests', name: 'Tests existen y pasan (coverage > 80%)', verification: 'Exit code 0, coverage > 80%', severity: 'Alto', level: 1, completed: false },

  { id: 14, category: 'Deploy', name: 'Config de deploy detectada (vercel.json / Dockerfile)', verification: 'ls *.json *.toml Dockerfile', severity: 'Crítico', level: 0, completed: true },
  { id: 15, category: 'Deploy', name: 'Deploy a plataforma correcta (URL live responde 200)', verification: 'URL live responde 200', severity: 'Crítico', level: 0, completed: true },
  { id: 16, category: 'Deploy', name: 'Variables de entorno en plataforma (NO en repo)', verification: 'Dashboard Vercel/Netlify/CF', severity: 'Crítico', level: 0, completed: true },
  { id: 17, category: 'Deploy', name: 'Preview deployments en PRs', verification: 'GitHub Checks en PR', severity: 'Medio', level: 1, completed: true },

  { id: 18, category: 'Runtime', name: 'Health endpoint (/api/health o /healthz) responde 200', verification: 'curl -I https://<url>/api/health', severity: 'Alto', level: 0, completed: true },
  { id: 19, category: 'Runtime', name: 'Error tracking (Sentry / Vercel Analytics / CF)', verification: 'Dashboard configurado', severity: 'Medio', level: 2, completed: false },
  { id: 20, category: 'Runtime', name: 'Logs estructurados (pino / winston / console JSON)', verification: 'Código revisado', severity: 'Medio', level: 2, completed: true },

  { id: 21, category: 'Performance', name: 'Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms', verification: 'Lighthouse / Speed Insights', severity: 'Medio', level: 2, completed: true },
  { id: 22, category: 'Performance', name: 'Assets con cache headers (static: 1 año, HTML: no-cache)', verification: 'curl -I /assets/*', severity: 'Medio', level: 2, completed: true },

  { id: 23, category: 'SEO/Access', name: 'robots.txt, sitemap.xml, meta tags Open Graph/Twitter', verification: 'curl /robots.txt', severity: 'Medio', level: 1, completed: true },
  { id: 24, category: 'SEO/Access', name: 'Accesibilidad: WCAG 2.1 AA (axe-core en CI)', verification: 'npm run test:a11y', severity: 'Medio', level: 2, completed: false },

  { id: 25, category: 'Docs', name: 'README.md con descripción, install, run, deploy, env vars', verification: 'cat README.md', severity: 'Alto', level: 0, completed: true },
  { id: 26, category: 'Docs', name: 'CHANGELOG.md o CHANGES.md actualizado', verification: 'cat CHANGELOG.md', severity: 'Medio', level: 2, completed: true },
  { id: 27, category: 'Docs', name: 'SPEC.md con criterios de aceptación', verification: 'cat SPEC.md', severity: 'Medio', level: 2, completed: true },

  { id: 28, category: 'Infra', name: 'DNS configurado (dominio custom + SSL)', verification: 'dig +short <dominio>', severity: 'Medio', level: 2, completed: true },
  { id: 29, category: 'Infra', name: 'CDN / Edge activado (Vercel Edge, CF Pages, Netlify)', verification: 'Dashboard configurado', severity: 'Medio', level: 2, completed: true },
  { id: 30, category: 'Monitoring', name: 'Uptime monitor (UptimeRobot / BetterUptime)', verification: 'Monitor activo 24/7', severity: 'Medio', level: 2, completed: false },
];

export const ProductionChecklistView: React.FC<Props> = ({ lang }) => {
  const [criteria, setCriteria] = useState<ChecklistCriterion[]>(CRITERIA_DATA);
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const t = translations[lang];

  const toggleCriterion = (id: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  const handleSimulatePassAll = () => {
    setCriteria((prev) => prev.map((c) => ({ ...c, completed: true })));
  };

  const handleReset = () => {
    setCriteria(CRITERIA_DATA);
  };

  const filteredCriteria = useMemo(() => {
    return criteria.filter((c) => {
      const matchLevel = selectedLevel === 'all' || c.level <= selectedLevel;
      const matchSeverity = selectedSeverity === 'all' || c.severity === selectedSeverity;
      const matchSearch =
        searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.verification.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLevel && matchSeverity && matchSearch;
    });
  }, [criteria, selectedLevel, selectedSeverity, searchQuery]);

  // Scoring
  const totalInFilter = filteredCriteria.length;
  const completedInFilter = filteredCriteria.filter((c) => c.completed).length;
  const percentComplete = totalInFilter > 0 ? Math.round((completedInFilter / totalInFilter) * 100) : 0;

  // Level compliance check
  const level0Total = criteria.filter((c) => c.level === 0);
  const level0Passed = level0Total.every((c) => c.completed);

  const level1Total = criteria.filter((c) => c.level <= 1);
  const level1Passed = level1Total.every((c) => c.completed);

  const level2Total = criteria;
  const level2Passed = level2Total.every((c) => c.completed);

  const handleExport = () => {
    const report = `# AUDITORÍA DE PRODUCCIÓN — belentani-workspace
Generado: ${new Date().toISOString()}
Cumplimiento General: ${percentComplete}% (${completedInFilter}/${totalInFilter})

## Niveles de Certificación
- Nivel 0 (MVP): ${level0Passed ? '✅ APROBADO' : '❌ PENDIENTE'}
- Nivel 1 (Producción Básica): ${level1Passed ? '✅ APROBADO' : '❌ PENDIENTE'}
- Nivel 2 (Producción Robusta): ${level2Passed ? '✅ APROBADO' : '❌ PENDIENTE'}

## Matriz de Criterios Detallada
| # | Estado | Categoría | Criterio | Verificación | Severidad | Nivel |
|---|--------|-----------|----------|--------------|-----------|-------|
${criteria.map(c => `| ${c.id} | ${c.completed ? '✅' : '❌'} | ${c.category} | ${c.name} | ${c.verification} | ${c.severity} | Nivel ${c.level} |`).join('\n')}
`;

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-production-readiness-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-pink-500/20 text-pink-400">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">{t.checklistTitle}</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">{t.checklistSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulatePassAll}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{t.simulatePassAll}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-medium transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetChecklist}</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportAuditReport}</span>
          </button>
        </div>
      </div>

      {/* Compliance Scorecards & Certification Badges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall score card */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t.complianceRate}
            </span>
            <div className="text-3xl font-extrabold text-white mt-1">
              {percentComplete}%
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              {completedInFilter} de {totalInFilter} criterios
            </span>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-zinc-800 flex items-center justify-center font-bold text-sm text-indigo-400 relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-zinc-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500 transition-all duration-500"
                strokeDasharray={`${percentComplete}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs">{percentComplete}%</span>
          </div>
        </div>

        {/* Level 0 Card */}
        <div className={`p-4 rounded-2xl border transition-all ${
          level0Passed
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase">{t.level0}</span>
            {level0Passed ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
          </div>
          <div className="text-lg font-bold text-white mt-2">
            {level0Passed ? 'CERTIFICADO' : 'Incompleto'}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">10 Criterios críticos (MVP)</p>
        </div>

        {/* Level 1 Card */}
        <div className={`p-4 rounded-2xl border transition-all ${
          level1Passed
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase">{t.level1}</span>
            {level1Passed ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
          </div>
          <div className="text-lg font-bold text-white mt-2">
            {level1Passed ? 'CERTIFICADO' : 'Incompleto'}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">19 Criterios (App Pública)</p>
        </div>

        {/* Level 2 Card */}
        <div className={`p-4 rounded-2xl border transition-all ${
          level2Passed
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase">{t.level2}</span>
            {level2Passed ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
          </div>
          <div className="text-lg font-bold text-white mt-2">
            {level2Passed ? 'CERTIFICADO' : 'Incompleto'}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">30 Criterios (SaaS / Crítico)</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/40 border border-zinc-800 p-3.5 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Level Filter */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedLevel === 'all' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setSelectedLevel(0)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedLevel === 0 ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Nivel 0
            </button>
            <button
              onClick={() => setSelectedLevel(1)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedLevel === 1 ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Nivel 1
            </button>
            <button
              onClick={() => setSelectedLevel(2)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedLevel === 2 ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Nivel 2
            </button>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            {['all', 'Crítico', 'Alto', 'Medio'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedSeverity === sev
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {sev === 'all' ? t.filterAll : sev}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Filtrar criterios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Criteria Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-12 text-center">Estado</th>
                <th className="py-3 px-4 w-32">Categoría</th>
                <th className="py-3 px-4">Criterio de Calidad</th>
                <th className="py-3 px-4">Método de Verificación</th>
                <th className="py-3 px-4 w-24 text-center">Severidad</th>
                <th className="py-3 px-4 w-20 text-center">Nivel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredCriteria.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => toggleCriterion(c.id)}
                  className={`hover:bg-zinc-800/40 cursor-pointer transition-colors ${
                    c.completed ? 'bg-zinc-950/20' : 'bg-red-950/5'
                  }`}
                >
                  <td className="py-3 px-4 text-center font-mono text-zinc-500 font-bold">
                    {c.id}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div
                      className={`w-5 h-5 mx-auto rounded-md flex items-center justify-center transition-all ${
                        c.completed
                          ? 'bg-emerald-500 text-black'
                          : 'border border-zinc-700 bg-zinc-900'
                      }`}
                    >
                      {c.completed && <CheckCheck className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-zinc-300">
                    {c.category}
                  </td>
                  <td className="py-3 px-4 font-medium text-white">
                    {c.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-400 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 inline-block">
                      {c.verification}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.severity === 'Crítico'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : c.severity === 'Alto'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {c.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-zinc-400">
                    N{c.level}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
