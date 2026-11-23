import React, { useMemo, useState } from 'react';
import {
  Language,
  OmegaAxiom,
  OmegaCheckStatus,
  OmegaDiagnosticLayer,
  OmegaFixStep,
  OmegaLayerId,
  OmegaTargetProfile,
} from '../../types';
import { translations } from '../../locales/i18n';
import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Database,
  Download,
  Layers,
  Lock,
  Network,
  Play,
  RotateCcw,
  Server,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

interface Props {
  lang: Language;
}

type SubView = 'matrix' | 'axioms' | 'fix_protocol' | 'frontier';

const INITIAL_AXIOMS: OmegaAxiom[] = [
  {
    id: 'ax1',
    number: '01',
    title: 'Observabilidad Absoluta',
    summary:
      'Métricas, logs y trazados distribuidos como única fuente de verdad sin puntos ciegos.',
    standard: 'OpenTelemetry · Trace Context W3C · SLO/SLI Alerting',
    verified: true,
  },
  {
    id: 'ax2',
    number: '02',
    title: 'Infraestructura Inmutable y GitOps',
    summary:
      'Estado deseado definido en código; servidores y contenedores se reemplazan, nunca se parchean a mano.',
    standard: 'Terraform / Pulumi · ArgoCD / Flux · Zero Drift',
    verified: true,
  },
  {
    id: 'ax3',
    number: '03',
    title: 'Arquitectura Zero-Trust',
    summary:
      'Red asumida como comprometida; autenticación mutua obligatoria y privilegio mínimo en IAM y datos.',
    standard: 'mTLS · Istio / Linkerd · SPIFFE Identity',
    verified: false,
  },
  {
    id: 'ax4',
    number: '04',
    title: 'Idempotencia y Estado Efímero',
    summary:
      'Cómputo sin estado y desechable; persistencia desacoplada en caché distribuida, colas y bases externas.',
    standard: 'Stateless Compute · Distributed Redis · Idempotent Jobs',
    verified: true,
  },
  {
    id: 'ax5',
    number: '05',
    title: 'Design for Failure',
    summary:
      'Resiliencia nativa frente a particiones de red, discos corruptos o caída total de zonas de disponibilidad.',
    standard: 'Circuit Breaker · Exponential Backoff · Bulkheads',
    verified: false,
  },
];

const BASE_LAYERS: OmegaDiagnosticLayer[] = [
  {
    id: 'L0',
    layerLabel: 'Capa 0',
    title: 'Hardware, Edge y Firmware',
    diagnostics: [
      'Telemetría térmica de sensores y desgaste SMART en NVMe / RAID',
      'Saturación de bus PCIe y ancho de banda de interfaz física',
      'Latencia física de red y pérdida de tramas en nodos Edge',
    ],
    actions: [
      'Aislar y drenar nodos con degradación de disco o ECC errors',
      'Actualizar firmware de controladora y BIOS vía BMC / IPMI',
      'Reasignar cargas críticas a nodos de silicio verificado',
    ],
    tools: ['SMARTmontools', 'ipmitool', 'Node Exporter', 'NVMe-CLI'],
    status: 'nominal',
    findings: 'Sin errores ECC ni contención PCIe detectados en el perfil base.',
  },
  {
    id: 'L1',
    layerLabel: 'Capa 1',
    title: 'Red, DNS y Perímetro',
    diagnostics: [
      'Análisis de paquetes (pcap), rutas BGP y resolución Anycast DNS',
      'Latencia de handshake TCP/TLS y saturación de sockets en TIME_WAIT',
      'Reglas de WAF, rate-limiting y mitigación de ataques DDoS L4/L7',
    ],
    actions: [
      'Habilitar control de congestión TCP BBR y ajustar keep-alives',
      'Implementar Anycast DNS con TTL calibrado y TLS 1.3 0-RTT selectivo',
      'Reconfigurar balanceadores L4/L7 con health checks activos',
    ],
    tools: ['tcpdump', 'Cilium / Hubble', 'Cloudflare WAF', 'Envoy L7'],
    status: 'nominal',
    findings: 'Handshake TLS optimizado; pendiente verificar reutilización de conexiones upstream.',
  },
  {
    id: 'L2',
    layerLabel: 'Capa 2',
    title: 'Sistema Operativo, Contenedores y Orquestación',
    diagnostics: [
      'Kernel panics, OOM Kills y throttling de CPU en cgroups',
      'Evicción de Pods en Kubernetes y fragmentación de namespaces',
      'Overhead de monitoreo o falta de visibilidad a nivel de syscalls',
    ],
    actions: [
      'Ajustar parámetros sysctl (somaxconn, swappiness, fs.file-max)',
      'Calibrar Requests/Limits de contenedores y activar HPA + Karpenter',
      'Desplegar sondas eBPF para trazado de kernel con overhead < 1%',
    ],
    tools: ['eBPF / Pixie', 'Kubernetes HPA', 'Karpenter', 'sysctl'],
    status: 'degraded',
    findings: 'Posible throttling de CPU bajo picos de tráfico; revisar límites de cgroup.',
  },
  {
    id: 'L3',
    layerLabel: 'Capa 3',
    title: 'Runtime, Aplicación y Lógica de Negocio',
    diagnostics: [
      'Fugas de memoria (Memory Leaks), deadlocks y pausas largas de GC',
      'Bloqueo del event loop o contención de thread pools',
      'Complejidad algorítmica O(n²) en rutas críticas de negocio',
    ],
    actions: [
      'Ejecutar flamegraphs de CPU/Memoria (perf, async-profiler)',
      'Aplicar caché multinivel (L1 en memoria local, L2 Redis distribuido)',
      'Migrar módulos de cómputo intensivo a WebAssembly (Wasm) en el borde',
    ],
    tools: ['perf / Flamegraph', 'OpenTelemetry SDK', 'Redis L2', 'WebAssembly'],
    status: 'nominal',
    findings: 'Cobertura de trazas activa; validar estrategia de caché L1/L2 en endpoints calientes.',
  },
  {
    id: 'L4',
    layerLabel: 'Capa 4',
    title: 'Datos, Estado y Transacciones',
    diagnostics: [
      'Bloqueos de filas/tablas (Locks), consultas N+1 e índices ausentes',
      'Lag de replicación entre primario y réplicas de lectura',
      'Inconsistencia eventual no manejada o crecimiento anómalo del WAL',
    ],
    actions: [
      'Implementar CQRS y Event Sourcing para desacoplar lecturas y escrituras',
      'Optimizar planes de ejecución (EXPLAIN ANALYZE) y connection pooling',
      'Configurar sharding o motor multi-modelo con soporte vectorial (pgvector)',
    ],
    tools: ['EXPLAIN ANALYZE', 'PgBouncer', 'PostgreSQL + pgvector', 'Kafka'],
    status: 'degraded',
    findings: 'Se recomienda auditoría de índices y pooling transaccional bajo alta concurrencia.',
  },
];

const INITIAL_FIX_STEPS: OmegaFixStep[] = [
  {
    step: 1,
    code: 'F1',
    title: 'Contención (Triage y Mitigación)',
    objective: 'Detener el sangrado y reducir el radio de explosión inmediatamente.',
    action: 'Aislar componente degradado, activar fallback elegante, escalar réplicas o ejecutar rollback.',
    completed: true,
    notes: 'Rutas de fallback y circuit breaker verificadas para evitar cascadas.',
  },
  {
    step: 2,
    code: 'F2',
    title: 'Telemetría Profunda (Deep Tracing)',
    objective: 'Localizar la anomalía exacta correlacionando logs, métricas y trazas.',
    action: 'Seguir Trace ID distribuido hasta el span exacto con latencia anómala o error 5xx.',
    completed: false,
    notes: 'Inspeccionar spans de base de datos y llamadas gRPC/HTTP externas.',
  },
  {
    step: 3,
    code: 'F3',
    title: 'Análisis de Causa Raíz (RCA)',
    objective: 'Comprender el porqué estructural aplicando la técnica de los 5 Porqués.',
    action: 'Distinguir entre deriva de configuración, bug algorítmico, límite de cgroup o dependencia externa.',
    completed: false,
    notes: 'Documentar cadena causal sin omitir condiciones de contorno.',
  },
  {
    step: 4,
    code: 'F4',
    title: 'Remediación y Parche (Fix)',
    objective: 'Corregir el defecto con prueba de regresión y despliegue controlado.',
    action: 'Escribir test que reproduzca el fallo, validar CI/CD (< 5 min) y desplegar vía Canary.',
    completed: false,
    notes: 'Validar cobertura mínima del 85% en ramas críticas afectadas.',
  },
  {
    step: 5,
    code: 'F5',
    title: 'Inmunidad Sistémica (Post-Mortem)',
    objective: 'Fortalecer la plataforma para impedir recurrencia del incidente.',
    action: 'Redactar Post-Mortem sin culpa, ajustar alertas por SLO/SLI y actualizar IaC.',
    completed: false,
    notes: 'Sincronizar runbook operativo y añadir experimento de Chaos Engineering.',
  },
];

const GOLDEN_PRACTICES = [
  {
    domain: 'Ingeniería de Software y Código',
    items: [
      { name: 'Clean Architecture & DDD', detail: 'Dominio de negocio aislado de infraestructura y UI mediante Bounded Contexts.' },
      { name: 'Pirámide de Testing (70/20/10)', detail: '70% Unitarios, 20% Contrato/Integración (Pact), 10% E2E (Playwright). Cobertura >= 85%.' },
      { name: 'Inmutabilidad Funcional', detail: 'Estructuras inmutables para eliminar side-effects y garantizar seguridad concurrente.' },
    ],
  },
  {
    domain: 'DevOps, SRE y Despliegue',
    items: [
      { name: 'CI/CD Sub-5 Minutos', detail: 'Caché distribuido y compilación remota con despliegue Blue-Green o Canary (Istio/Flagger).' },
      { name: 'Chaos Engineering Proactivo', detail: 'Inyección controlada de latencia, pérdida de paquetes y muerte de pods en staging/prod.' },
      { name: 'Bóvedas Dinámicas de Secretos', detail: 'Cero secretos estáticos; credenciales efímeras con rotación automática (Vault / SPIFFE).' },
    ],
  },
  {
    domain: 'Seguridad DevSecOps',
    items: [
      { name: 'Shift-Left SAST / SCA / DAST', detail: 'Escaneo estático y de dependencias en cada commit más pruebas dinámicas en staging.' },
      { name: 'Contenedores Distroless Firmados', detail: 'Imágenes mínimas sin shell ni utilidades redundantes, firmadas criptográficamente con Cosign.' },
    ],
  },
];

const FRONTIER_PARADIGMS = [
  {
    name: 'AIOps y Auto-Remediación',
    horizon: 'Operación Autónoma',
    description:
      'Detección temprana de anomalías sobre series temporales de métricas antes de alcanzar umbrales estáticos, disparando runbooks idempotentes vía webhooks.',
    benchmarks: 'MTTD reducido · Respuesta determinista por patrón',
  },
  {
    name: 'Edge Computing y WebAssembly (Wasm)',
    horizon: 'Latencia Global < 10 ms',
    description:
      'Ejecución de lógica crítica en nodos perimetrales (Cloudflare Workers, Fastly Compute) compilada a Wasm para aislar memoria y descargar el núcleo central.',
    benchmarks: 'Cold start < 1 ms · Ejecución sandboxed',
  },
  {
    name: 'Bases de Datos Multi-Modelo',
    horizon: 'Estado Unificado',
    description:
      'Consolidación relacional, documental, grafos y vectores (pgvector) en un único motor transaccional para eliminar la sincronización frágil entre 5 motores.',
    benchmarks: 'ACID + Búsqueda Vectorial · Cero ETL intermedio',
  },
  {
    name: 'Criptografía Post-Cuántica',
    horizon: 'Resistencia a Largo Plazo',
    description:
      'Adopción progresiva de intercambio de claves y firmas resistentes a computación cuántica (ML-KEM / Kyber, ML-DSA / Dilithium) frente a ataques harvest-now-decrypt-later.',
    benchmarks: 'NIST PQC Standards · Hibridación TLS 1.3',
  },
];

const STACK_PRESETS = [
  'Kubernetes + Go/Rust + PostgreSQL + Istio',
  'Next.js + Edge Wasm + PostgreSQL + Redis',
  'FastAPI + Docker + Redis + PgBouncer',
  'Monolito Legacy + Bare Metal / VM',
];

const SYMPTOM_PRESETS = [
  'Picos de 5xx y OOMKills bajo carga',
  'Latencia en DB (N+1) y lag de replicación',
  'Saturación TLS / TIME_WAIT o tráfico DDoS',
  'Fugas de memoria, deadlocks y pausas GC',
  'Migración a Zero-Trust y Edge < 10ms',
];

const TARGET_TEMPLATES = [
  'belentani-workspace',
  'saas-plasma',
  'belentani-unified-master',
  'secure-t-university',
  'deepseek-harness',
];

export const OmegaPrimeView: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];

  const [target, setTarget] = useState<OmegaTargetProfile>({
    platformName: 'saas-plasma',
    stackPreset: STACK_PRESETS[0],
    symptomProfile: SYMPTOM_PRESETS[0],
    scaleGoal: '99.99% SLA · < 50ms p99 global',
  });

  const [subView, setSubView] = useState<SubView>('matrix');
  const [axioms, setAxioms] = useState<OmegaAxiom[]>(INITIAL_AXIOMS);
  const [layers, setLayers] = useState<OmegaDiagnosticLayer[]>(BASE_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState<OmegaLayerId>('L2');
  const [fixSteps, setFixSteps] = useState<OmegaFixStep[]>(INITIAL_FIX_STEPS);
  const [fiveWhys, setFiveWhys] = useState<string[]>([
    'Por qué 1: Los pods de API devolvieron 503 y reiniciaron con código 137 (OOMKilled).',
    'Por qué 2: El consumo de memoria RSS creció sin límite durante ráfagas de tráfico.',
    'Por qué 3: La caché en memoria local no tenía política de evicción LRU acotada.',
    'Por qué 4: Faltaba límite de heap y descarga de sesiones hacia Redis L2.',
    'Por qué 5: No existían pruebas de carga ni alertas SLO de presión de memoria en CI.',
  ]);
  const [copiedReport, setCopiedReport] = useState(false);
  const [lastDiagnosisRun, setLastDiagnosisRun] = useState<string>('Inicializado sobre perfil saas-plasma');

  const selectedLayer = useMemo(
    () => layers.find((l) => l.id === selectedLayerId) || layers[0],
    [layers, selectedLayerId]
  );

  const runDiagnosticMatrix = () => {
    const symptom = target.symptomProfile.toLowerCase();
    const stack = target.stackPreset.toLowerCase();

    const updatedLayers: OmegaDiagnosticLayer[] = BASE_LAYERS.map((layer) => {
      if (layer.id === 'L0') {
        const isBareMetal = stack.includes('bare metal') || stack.includes('monolito');
        return {
          ...layer,
          status: isBareMetal ? 'degraded' : 'nominal',
          findings: isBareMetal
            ? `Infraestructura legacy detectada en ${target.platformName}: verificar estado NVMe, desgaste RAID y firmware BMC antes de escalar.`
            : `Nodos efímeros en ${target.platformName} sin anomalías físicas reportadas; aislamiento por zona de disponibilidad activo.`,
        };
      }
      if (layer.id === 'L1') {
        const netIssue = symptom.includes('tls') || symptom.includes('ddos') || symptom.includes('zero-trust');
        return {
          ...layer,
          status: netIssue ? 'degraded' : 'nominal',
          findings: netIssue
            ? `Alerta en perímetro para ${target.platformName}: activar TCP BBR, reducir TIME_WAIT, aplicar WAF L7 y validar mTLS estricto.`
            : `Resolución DNS y balanceo L4/L7 estables; mantener keep-alives calibrados para ${target.scaleGoal}.`,
        };
      }
      if (layer.id === 'L2') {
        const osIssue = symptom.includes('oomkill') || symptom.includes('5xx') || symptom.includes('zero-trust');
        return {
          ...layer,
          status: osIssue ? 'degraded' : 'nominal',
          findings: osIssue
            ? `Contención de cgroups / OOMKills detectada en ${target.platformName}: calibrar Requests/Limits, habilitar HPA/Karpenter e instrumentar eBPF.`
            : `Orquestación estable en ${target.stackPreset}; verificar paridad de réplicas multi-AZ.`,
        };
      }
      if (layer.id === 'L3') {
        const appIssue = symptom.includes('memoria') || symptom.includes('gc') || symptom.includes('5xx') || symptom.includes('edge');
        return {
          ...layer,
          status: appIssue ? 'degraded' : 'nominal',
          findings: appIssue
            ? `Riesgo en capa de runtime para ${target.platformName}: perfilar flamegraphs, acotar caché L1/L2 en Redis y mover rutas críticas a Wasm.`
            : `Lógica de negocio desacoplada; mantener pruebas de carga y trazado OpenTelemetry por span.`,
        };
      }
      // L4
      const dbIssue = symptom.includes('db') || symptom.includes('n+1') || symptom.includes('lag');
      return {
        ...layer,
        status: dbIssue ? 'degraded' : 'nominal',
        findings: dbIssue
          ? `Cuello de botella transaccional en ${target.platformName}: eliminar consultas N+1, activar PgBouncer, aplicar CQRS y revisar WAL/índices.`
          : `Capa de datos nominal; validar backups inmutables y aislamiento transaccional.`,
      };
    });

    setLayers(updatedLayers);

    const firstDegraded = updatedLayers.find((l) => l.status === 'degraded');
    if (firstDegraded) {
      setSelectedLayerId(firstDegraded.id);
    }

    setFixSteps((prev) =>
      prev.map((step) => {
        if (step.step === 1) {
          return {
            ...step,
            completed: true,
            notes: `Contención aplicada sobre ${target.platformName} (${target.symptomProfile}).`,
          };
        }
        if (step.step === 2) {
          return {
            ...step,
            completed: true,
            notes: `Trazas OpenTelemetry correlacionadas en capa ${firstDegraded ? firstDegraded.layerLabel : 'L3'}.`,
          };
        }
        return { ...step, completed: false };
      })
    );

    setLastDiagnosisRun(
      `Diagnóstico ejecutado para ${target.platformName} · ${updatedLayers.filter((l) => l.status === 'degraded').length} capas con hallazgos críticos`
    );
  };

  const resetAll = () => {
    setAxioms(INITIAL_AXIOMS);
    setLayers(BASE_LAYERS);
    setFixSteps(INITIAL_FIX_STEPS);
    setSelectedLayerId('L2');
    setLastDiagnosisRun('Matriz reiniciada al estado base');
  };

  const toggleAxiom = (id: string) => {
    setAxioms((prev) => prev.map((a) => (a.id === id ? { ...a, verified: !a.verified } : a)));
  };

  const updateLayerStatus = (id: OmegaLayerId, status: OmegaCheckStatus) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const updateLayerFindings = (id: OmegaLayerId, findings: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, findings } : l)));
  };

  const toggleFixStep = (stepNum: number) => {
    setFixSteps((prev) =>
      prev.map((s) => (s.step === stepNum ? { ...s, completed: !s.completed } : s))
    );
  };

  const updateFixStepNotes = (stepNum: number, notes: string) => {
    setFixSteps((prev) => prev.map((s) => (s.step === stepNum ? { ...s, notes } : s)));
  };

  const updateWhy = (index: number, value: string) => {
    setFiveWhys((prev) => prev.map((w, idx) => (idx === index ? value : w)));
  };

  const buildMarkdownReport = () => {
    return `# BLUEPRINT OMEGA-PRIME — ${target.platformName}
Generado: ${new Date().toISOString()}
Stack Tecnológico: ${target.stackPreset}
Síntoma / Objetivo: ${target.symptomProfile}
Meta de Escalabilidad: ${target.scaleGoal}

## Fase 1: Axiomas Fundamentales
${axioms.map((a) => `- [${a.verified ? 'x' : ' '}] ${a.number}. ${a.title} (${a.standard})`).join('\n')}

## Fase 2: Matriz de Diagnóstico Universal (5 Capas)
${layers
  .map(
    (l) => `### ${l.layerLabel}: ${l.title} [${l.status.toUpperCase()}]
- Hallazgos: ${l.findings}
- Herramientas: ${l.tools.join(' · ')}
- Acciones: ${l.actions.join('; ')}
`
  )
  .join('\n')}

## Fase 4: Protocolo Fix-It-All y 5 Porqués (RCA)
${fixSteps.map((s) => `- [${s.completed ? 'x' : ' '}] ${s.code} ${s.title}: ${s.notes}`).join('\n')}

### Cadena Causal (5 Porqués)
${fiveWhys.map((w, i) => `${i + 1}. ${w}`).join('\n')}
`;
  };

  const handleExportBlueprint = () => {
    const md = buildMarkdownReport();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OMEGA-PRIME-${target.platformName}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(buildMarkdownReport());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const verifiedAxiomsCount = axioms.filter((a) => a.verified).length;
  const degradedLayersCount = layers.filter((l) => l.status === 'degraded').length;
  const remediatedOrNominalCount = layers.filter(
    (l) => l.status === 'nominal' || l.status === 'remediated'
  ).length;
  const completedStepsCount = fixSteps.filter((s) => s.completed).length;

  const getLayerIcon = (id: OmegaLayerId) => {
    switch (id) {
      case 'L0':
        return <Cpu className="w-4 h-4" />;
      case 'L1':
        return <Network className="w-4 h-4" />;
      case 'L2':
        return <Server className="w-4 h-4" />;
      case 'L3':
        return <Layers className="w-4 h-4" />;
      case 'L4':
        return <Database className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: OmegaCheckStatus) => {
    switch (status) {
      case 'nominal':
        return { text: 'Nominal', classes: 'text-emerald-400', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> };
      case 'remediated':
        return { text: 'Remediado', classes: 'text-sky-400', icon: <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> };
      case 'degraded':
        return { text: 'Degradado', classes: 'text-amber-400', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> };
      case 'pending':
        return { text: 'Pendiente', classes: 'text-zinc-400', icon: <Activity className="w-3.5 h-3.5 text-zinc-400" /> };
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 text-xs text-zinc-400 font-mono">
            <span>Matriz de Resolución Universal</span>
            <span aria-hidden="true">·</span>
            <span>OpenTelemetry / GitOps / Zero-Trust</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight text-balance">
            {t.omegaTitle}
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl">
            {t.omegaSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.omegaResetTarget}</span>
          </button>
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedReport ? 'Copiado' : 'Copiar Runbook'}</span>
          </button>
          <button
            onClick={handleExportBlueprint}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.omegaExportBlueprint}</span>
          </button>
        </div>
      </div>

      {/* Target Intake Console */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Definición de Plataforma Objetivo y Síntomas
            </h3>
            <p className="text-xs text-zinc-400">
              {lastDiagnosisRun}
            </p>
          </div>
          <button
            onClick={runDiagnosticMatrix}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{t.omegaRunDiagnostic}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400">
              Plataforma / Repositorio
            </label>
            <input
              type="text"
              value={target.platformName}
              onChange={(e) => setTarget({ ...target, platformName: e.target.value })}
              list="omega-platform-presets"
              placeholder="Ej. saas-plasma"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <datalist id="omega-platform-presets">
              {TARGET_TEMPLATES.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400">
              Stack Tecnológico
            </label>
            <select
              value={target.stackPreset}
              onChange={(e) => setTarget({ ...target, stackPreset: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {STACK_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400">
              Síntoma o Vector de Fallo
            </label>
            <select
              value={target.symptomProfile}
              onChange={(e) => setTarget({ ...target, symptomProfile: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {SYMPTOM_PRESETS.map((sym) => (
                <option key={sym} value={sym}>
                  {sym}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-400">
              Objetivo de Escalabilidad / SLO
            </label>
            <input
              type="text"
              value={target.scaleGoal}
              onChange={(e) => setTarget({ ...target, scaleGoal: e.target.value })}
              placeholder="Ej. 99.99% SLA · < 50ms p99"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* Summary Metric Strip (Single-Elevation, Tabular Numerals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400">Axiomas Verificados</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
            {verifiedAxiomsCount} / {axioms.length}
          </div>
          <div className="text-xs text-zinc-500 mt-1">Fase 1 · Fundamentos</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400">Capas Sanas o Remediadas</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
            {remediatedOrNominalCount} / {layers.length}
          </div>
          <div className="text-xs text-zinc-500 mt-1">Capas 0 a 4</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400">Hallazgos Degradados</div>
          <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${degradedLayersCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {degradedLayersCount}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            {degradedLayersCount > 0 ? 'Requiere remediación' : 'Sin cuellos críticos'}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-400">Protocolo Fix-It-All</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
            {completedStepsCount} / {fixSteps.length}
          </div>
          <div className="text-xs text-zinc-500 mt-1">Fases F1 a F5</div>
        </div>
      </div>

      {/* Sub-view Segmented Bar */}
      <div className="flex flex-wrap items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl w-fit max-w-full overflow-x-auto">
        <button
          onClick={() => setSubView('matrix')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            subView === 'matrix' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          01. Matriz de 5 Capas
        </button>
        <button
          onClick={() => setSubView('axioms')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            subView === 'axioms' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          02. Axiomas y Buenas Prácticas
        </button>
        <button
          onClick={() => setSubView('fix_protocol')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            subView === 'fix_protocol' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          03. Protocolo Fix-It-All y RCA
        </button>
        <button
          onClick={() => setSubView('frontier')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            subView === 'frontier' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          04. Tecnología de Punta
        </button>
      </div>

      {/* SUBVIEW 1: 5-LAYER DIAGNOSTIC MATRIX */}
      {subView === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Layer Selector Column */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800 overflow-hidden">
            {layers.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              const statusInfo = getStatusLabel(layer.status);
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`w-full text-left p-4 transition-colors flex items-start justify-between gap-3 ${
                    isSelected ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                      {getLayerIcon(layer.id)}
                      <span>{layer.layerLabel}</span>
                    </div>
                    <div className="text-sm font-semibold text-white truncate">
                      {layer.title}
                    </div>
                    <div className="text-xs text-zinc-500 truncate">
                      {layer.tools.join(' · ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-xs font-medium">
                    {statusInfo.icon}
                    <span className={statusInfo.classes}>{statusInfo.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Layer Detail Inspector */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <div className="text-xs font-mono text-indigo-400">
                    {selectedLayer.layerLabel} · Escaneo Profundo
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {selectedLayer.title}
                  </h3>
                  <div className="text-xs text-zinc-400 mt-1">
                    {selectedLayer.tools.join(' · ')}
                  </div>
                </div>

                {/* State Transition Controls */}
                <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-1 rounded-lg">
                  {(['nominal', 'degraded', 'remediated'] as OmegaCheckStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateLayerStatus(selectedLayer.id, st)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        selectedLayer.status === st
                          ? 'bg-indigo-600 text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {getStatusLabel(st).text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diagnostics vs Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Vectores de Diagnóstico
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-300 leading-relaxed">
                    {selectedLayer.diagnostics.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-zinc-500 tabular-nums">0{i + 1}.</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Acciones de Remediación
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-300 leading-relaxed">
                    {selectedLayer.actions.map((a, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-indigo-400 tabular-nums">0{i + 1}.</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Editable Findings Box */}
            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <label className="block text-xs font-semibold text-zinc-400">
                Hallazgos y Telemetría de {selectedLayer.layerLabel} ({target.platformName})
              </label>
              <textarea
                rows={3}
                value={selectedLayer.findings}
                onChange={(e) => updateLayerFindings(selectedLayer.id, e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: AXIOMS & GOLDEN PRACTICES */}
      {subView === 'axioms' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Phase 1: 5 Axioms */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">
                Fase 1. Axiomas Fundamentales de Ingeniería
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Invariantes arquitectónicos innegociables aplicados sobre {target.platformName}.
              </p>
            </div>

            <div className="divide-y divide-zinc-800">
              {axioms.map((ax) => (
                <button
                  key={ax.id}
                  onClick={() => toggleAxiom(ax.id)}
                  className="w-full text-left py-3.5 flex items-start gap-3 hover:bg-zinc-800/30 px-2 rounded-lg transition-colors"
                >
                  <div
                    className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center shrink-0 transition-colors ${
                      ax.verified
                        ? 'bg-emerald-500 text-zinc-950'
                        : 'border border-zinc-600 bg-zinc-950'
                    }`}
                  >
                    {ax.verified && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-indigo-400 font-bold">
                        {ax.number}.
                      </span>
                      <span className="text-sm font-semibold text-white">{ax.title}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{ax.summary}</p>
                    <div className="text-[11px] font-mono text-zinc-500">{ax.standard}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Phase 3: Golden Practices */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
            <div className="pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">
                Fase 3. Arsenal de Buenas Prácticas (Estándares de Oro)
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Controles de arquitectura limpia, DevOps SRE y seguridad DevSecOps.
              </p>
            </div>

            <div className="space-y-5">
              {GOLDEN_PRACTICES.map((group) => (
                <div key={group.domain} className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    {group.domain}
                  </h4>
                  <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-lg bg-zinc-950/60">
                    {group.items.map((item) => (
                      <div key={item.name} className="p-3 space-y-1">
                        <div className="text-xs font-semibold text-white">{item.name}</div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 3: FIX-IT-ALL EXECUTION & 5 WHYS RCA */}
      {subView === 'fix_protocol' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 5 Execution Steps */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white">
                  Fase 4. Algoritmo de Ejecución Fix-It-All
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Secuencia operativa desde la contención inmediata hasta la inmunidad sistémica.
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-400 tabular-nums">
                {completedStepsCount} de {fixSteps.length} completadas
              </span>
            </div>

            <div className="divide-y divide-zinc-800">
              {fixSteps.map((step) => (
                <div key={step.step} className="py-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => toggleFixStep(step.step)}
                      className="flex items-start gap-3 text-left"
                    >
                      <div
                        className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center shrink-0 transition-colors ${
                          step.completed
                            ? 'bg-emerald-500 text-zinc-950'
                            : 'border border-zinc-600 bg-zinc-950'
                        }`}
                      >
                        {step.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          0{step.step}. {step.title}
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5">{step.objective}</div>
                      </div>
                    </button>
                    <span className="text-xs font-mono text-zinc-500 shrink-0">
                      {step.completed ? 'Completado' : 'Pendiente'}
                    </span>
                  </div>

                  <div className="pl-8 space-y-2">
                    <div className="text-xs text-zinc-300">
                      <span className="text-zinc-500 font-medium">Acción: </span>
                      {step.action}
                    </div>
                    <input
                      type="text"
                      value={step.notes}
                      onChange={(e) => updateFixStepNotes(step.step, e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive 5 Whys RCA */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                <Wrench className="w-3.5 h-3.5" />
                <span>Técnica RCA</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Cadena Causal: Los 5 Porqués
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Edita cada eslabón para documentar el Post-Mortem sin culpa antes de exportar.
              </p>
            </div>

            <div className="space-y-3">
              {fiveWhys.map((why, index) => (
                <div key={index} className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-400">
                    Nivel {index + 1}
                  </label>
                  <textarea
                    rows={2}
                    value={why}
                    onChange={(e) => updateWhy(index, e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 4: FRONTIER TECH (PHASE 5) */}
      {subView === 'frontier' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <div className="pb-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Fase 5. Paradigmas de Tecnología de Punta
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Capacidades avanzadas para llevar {target.platformName} al máximo operativo y de seguridad futura.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Post-Quantum · Edge Wasm · AIOps</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FRONTIER_PARADIGMS.map((item, idx) => (
              <div
                key={item.name}
                className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-5 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-indigo-400">
                    0{idx + 1}. {item.horizon}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {item.benchmarks}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
