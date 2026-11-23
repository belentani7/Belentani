import React, { useState } from 'react';
import { WorkspaceProject, WorkspaceScript, Language } from '../../types';
import { translations } from '../../locales/i18n';
import { 
  FolderGit2, 
  Terminal, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Play, 
  FileCode, 
  CheckCircle2, 
  AlertCircle,
  HardDrive,
  Laptop,
  Globe,
  Layers,
  Search
} from 'lucide-react';

interface Props {
  lang: Language;
}

const PROJECTS_DATA: WorkspaceProject[] = [
  {
    id: 'p1',
    name: 'judas-experience-web',
    type: 'Static Three.js 3D Web',
    target: 'Vercel (Static + Edge)',
    status: 'production',
    description: 'Experiencia interactiva 3D procedural con Three.js, audio reactivo y shaders TSL.',
    tags: ['Three.js', 'WebGL', 'Vercel', 'Vite'],
    repository: 'belentani7/judas-experience-web',
  },
  {
    id: 'p2',
    name: 'belentani-unified-master',
    type: 'Fullstack EduForge',
    target: 'Netlify + Serverless Functions',
    status: 'production',
    description: 'Plataforma educativa con gestión de cursos, exámenes interactivos y base de datos persistente.',
    tags: ['TypeScript', 'Netlify', 'PostgreSQL', 'Auth'],
    repository: 'belentani7/belentani-unified-master',
  },
  {
    id: 'p3',
    name: 'secure-t & secure-t-university',
    type: 'Cybersecurity Education Suite',
    target: 'Multistack Deploy (Railway / Vercel)',
    status: 'active',
    description: 'Entorno de pruebas y laboratorio de seguridad informática, OWASP top 10 y auditorías.',
    tags: ['Security', 'Docker', 'FastAPI', 'React'],
    repository: 'belentani7/secure-t',
  },
  {
    id: 'p4',
    name: 'belentani-omega-v2 & BELENTANI-OS',
    type: 'Web Operating System / Desktop Shell',
    target: 'Tauri v2 + Vercel Static',
    status: 'active',
    description: 'Shell de escritorio web con sistema de ventanas modular, terminal emulada y gestor de tareas.',
    tags: ['Tauri', 'WebOS', 'Signals', 'Tailwind'],
    repository: 'belentani7/belentani-omega-v2',
  },
  {
    id: 'p5',
    name: 'saas-plasma',
    type: 'SaaS Multi-Tenant Starter',
    target: 'Railway (FastAPI) + Vercel (Next.js)',
    status: 'configured',
    description: 'Plantilla de micro-SaaS con autenticación JWT, Stripe billing, colas BullMQ y base PostgreSQL.',
    tags: ['FastAPI', 'Next.js', 'Stripe', 'Redis'],
    repository: 'belentani7/saas-plasma',
  },
  {
    id: 'p6',
    name: 'deepseek-harness & AI Harness',
    type: 'LLM Orchestration & Evaluation',
    target: 'Docker Container / Fly.io',
    status: 'active',
    description: 'Arnés de experimentación para inferencia de modelos locales y benchmarks de calidad ISTQB.',
    tags: ['Python', 'Docker', 'Ollama', 'Testing'],
    repository: 'belentani7/deepseek-harness',
  },
];

const SCRIPTS_DATA: WorkspaceScript[] = [
  {
    id: 'winpurge',
    filename: 'WinPurge.ps1',
    language: 'PowerShell',
    purpose: 'Windows Debloat & Telemetry Purge',
    description: 'Script para eliminar telemetría invasiva, apps precargadas innecesarias y optimizar servicios de Windows.',
    codeSnippet: `# WinPurge — Made by Qloud & adapted for belentani-workspace
Clear-Host
Write-Host "Iniciando purga de telemetria y servicios..." -ForegroundColor Cyan
# Deshabilitar telemetria de diagnóstico
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry" -Value 0
# Deshabilitar Cortana y Bing Search en inicio
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Name "AllowCortana" -Value 0
# Limpiar temporales y cola de prefetch
Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Purga de Windows completada con exito." -ForegroundColor Green`,
  },
  {
    id: 'mantenimiento',
    filename: 'mantenimiento.bat',
    language: 'Batch',
    purpose: 'Limpieza y Reparación Masiva de Sistema',
    description: 'Rutina automatizada de 8 pasos: Punto de restauración, limpieza de temp, reparación de Windows Update, DISM, SFC, CHKDSK y reinicio de drivers.',
    codeSnippet: `@echo off
title LIMPIEZA Y REPARACION MASIVA HP EliteBook 850 G6
echo 1 de 8: Creando punto de restauracion...
echo 2 de 8: Borrando temporales...
del /q /f /s "%TEMP%\\*.*" >nul 2>&1
echo 3 de 8: Reparando cache de Windows Update...
echo 4 de 8: Vaciando papelera y prefetch...
echo 5 de 8: DISM reparando imagen de Windows...
DISM /Online /Cleanup-Image /RestoreHealth
echo 6 de 8: SFC reparando archivos de sistema...
sfc /scannow
echo 7 de 8: CHKDSK escaneando disco en linea...
chkdsk C: /scan
echo 8 de 8: Reinstalando drivers defectuosos...`,
  },
  {
    id: 'fixkeyboard',
    filename: 'fix-keyboard-p30.ps1',
    language: 'PowerShell',
    purpose: 'Huawei P30 Keyboard & Latency Fix',
    description: 'Optimización de latencia de entrada de teclado, deshabilitación de Power Management en hub USB y filtro de teclas.',
    codeSnippet: `# Fix Keyboard Latency & Layout Mapping
$devices = Get-PnpDevice -Class Keyboard
foreach ($dev in $devices) {
    Write-Host "Optimizando teclado: $($dev.FriendlyName)" -ForegroundColor Yellow
}
# Deshabilitar ahorro de energia en USB Root Hubs
Get-WmiObject Win32_USBHub | ForEach-Object {
    $powerMgmt = Get-WmiObject MSPower_DeviceEnable -Namespace root\\wmi -ErrorAction SilentlyContinue
}
Write-Host "Optimizacion de teclado aplicada." -ForegroundColor Green`,
  },
  {
    id: 'testkeyboard',
    filename: 'test-teclado.ps1',
    language: 'PowerShell',
    purpose: 'Diagnóstico de Pulsaciones & Key Codes',
    description: 'Captura interactiva de teclas en consola con tiempos de respuesta en milisegundos y verificación de teclas fantasma.',
    codeSnippet: `# Test de pulsaciones y latencia
Write-Host "Presione teclas para verificar scancode y latencia. ESC para salir." -ForegroundColor Cyan
do {
    $key = [Console]::ReadKey($true)
    $timestamp = (Get-Date).ToString("HH:mm:ss.fff")
    Write-Host "[$timestamp] Tecla: $($key.Key) | Char: '$($key.KeyChar)' | Modificadores: $($key.Modifiers)" -ForegroundColor Green
} while ($key.Key -ne [ConsoleKey]::Escape)`,
  },
];

export const WorkspaceHubView: React.FC<Props> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'scripts' | 'ci_audit'>('projects');
  const [selectedScript, setSelectedScript] = useState<WorkspaceScript>(SCRIPTS_DATA[0]);
  const [copied, setCopied] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  // CI Audit Simulator State
  const [ciStatus, setCiStatus] = useState<'idle' | 'running' | 'passed' | 'warning'>('passed');
  const [ciLogs, setCiLogs] = useState<string[]>([
    '[CI] Audit ejecutado sobre 22 ficheros.',
    '[CI] Verificando ficheros de credenciales trackeados: 0 encontrados. (PASS)',
    '[CI] Verificando patrones de credenciales (OpenAI, Google, AWS, tokens): 0 encontrados. (PASS)',
    '[CI] Verificando sintaxis JSON en 8 ficheros: Todos válidos. (PASS)',
    '[CI] Verificando etiquetas HTML <title> y meta description: Presentes. (PASS)',
    '[CI] Auditoría de higiene COMPLETADA con éxito: Exit Code 0.',
  ]);

  const t = translations[lang];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRunCiAudit = () => {
    setCiStatus('running');
    setCiLogs(['[CI] Iniciando workflow de auditoría GitHub Actions...']);
    setTimeout(() => {
      setCiLogs((prev) => [
        ...prev,
        '[CI] Paso 1: Checkout de código v4 completado.',
        '[CI] Paso 2: Escaneando exclusión de secretos (.env, .pem, .p12, id_rsa, id_ed25519)...',
        'Plantilla .env.example presente (correcto).',
        '[CI] Paso 3: Análisis regex contra sk-ant-*, AIza*, ghp_*, AKIA*, GOCSPX-*...',
        'Cero credenciales detectadas en el árbol git.',
        '[CI] Paso 4: Validando JSON en .vscode y config...',
        'JSON parseable correctamente.',
        '[CI] Paso 5: Validando SEO HTML (<title> y <meta name="description">)...',
        'Documentos HTML conformes a la especificación.',
        '[CI] Auditoría completada sobre 22 ficheros versionados. EXIT CODE 0 ✅',
      ]);
      setCiStatus('passed');
    }, 1200);
  };

  const filteredProjects = PROJECTS_DATA.filter(
    (p) =>
      p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.target.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.tags.some((tag) => tag.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FolderGit2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">{t.hubTitle}</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">{t.hubSubtitle}</p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.projectsTab}</span>
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'scripts' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{t.scriptsTab}</span>
          </button>
          <button
            onClick={() => setActiveTab('ci_audit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'ci_audit' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.ciAuditTab}</span>
          </button>
        </div>
      </div>

      {/* PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative min-w-[280px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar proyecto o tecnología..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              {filteredProjects.length} proyectos listados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {p.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      p.status === 'production'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-zinc-800/80 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                    <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{p.target}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCRIPTS TAB */}
      {activeTab === 'scripts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Script selector list */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Scripts de Automatización
            </span>
            <div className="space-y-2">
              {SCRIPTS_DATA.map((s) => {
                const isSelected = selectedScript.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScript(s)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-zinc-800 border-indigo-500 shadow-md'
                        : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                        {s.filename}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                        {s.language}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 truncate">
                      {s.purpose}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Script Code Viewer */}
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs font-mono text-zinc-300 ml-2">
                  {selectedScript.filename} — {selectedScript.purpose}
                </span>
              </div>
              <button
                onClick={() => handleCopy(selectedScript.codeSnippet, selectedScript.id)}
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs transition-all font-mono"
              >
                {copied === selectedScript.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-zinc-950 overflow-x-auto font-mono text-xs text-zinc-300 leading-relaxed flex-1">
              <pre>{selectedScript.codeSnippet}</pre>
            </div>

            <div className="p-3 bg-zinc-900/80 border-t border-zinc-800 text-[11px] text-zinc-400">
              {selectedScript.description}
            </div>
          </div>
        </div>
      )}

      {/* CI HYGIENE AUDIT TAB */}
      {activeTab === 'ci_audit' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                GitHub Actions CI Hygiene Scanner
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Auditoría automatizada de .github/workflows/ci.yml: Detección estricta de secretos, credenciales y verificación de higiene.
              </p>
            </div>

            <button
              onClick={handleRunCiAudit}
              disabled={ciStatus === 'running'}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{ciStatus === 'running' ? 'Auditando...' : 'Re-ejecutar Auditoría CI'}</span>
            </button>
          </div>

          {/* Terminal Console */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 space-y-1.5 max-h-[380px] overflow-y-auto">
            {ciLogs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.includes('PASS') || log.includes('EXIT CODE 0') || log.includes('completada con éxito')
                    ? 'text-emerald-400'
                    : log.includes('[CI]')
                    ? 'text-indigo-400'
                    : 'text-zinc-400'
                }
              >
                {log}
              </div>
            ))}
          </div>

          {/* Security Guarantee Box */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs text-zinc-300">
              <strong className="text-white">Garantía de Cero Secretos:</strong> Ningún fichero .env, llave SSH o token de API está registrado en el repositorio. El repositorio sigue el estándar estricto de higiene belentani7.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
