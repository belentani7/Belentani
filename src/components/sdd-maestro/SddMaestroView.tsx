import React, { useState } from 'react';
import { SDDStage, SDDStageId, SDDPrinciple, Language } from '../../types';
import { translations } from '../../locales/i18n';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Cpu, 
  Lock,
  GitBranch,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';

interface Props {
  lang: Language;
}

const DEFAULT_STAGES: SDDStage[] = [
  {
    id: 'E0',
    name: 'E0 INTAKE',
    tagline: 'Entender antes de tocar',
    description: 'Reformular en 1-3 frases. Detectar proyecto. Buscar contexto existente. Aclarar ambigüedades.',
    gateRequirement: 'Usuario confirma o petición inequívoca sin asunciones implícitas.',
    artifact: 'Resumen de intake + preguntas resueltas',
    status: 'passed',
    checklist: [
      { id: 'e0_1', text: 'Petición reformulada en ≤3 frases claras', completed: true },
      { id: 'e0_2', text: 'Detección de proyecto y stack existente', completed: true },
      { id: 'e0_3', text: 'Clarify ejecutado si había ambigüedad', completed: true },
    ]
  },
  {
    id: 'E1',
    name: 'E1 SPEC',
    tagline: 'Qué es "terminado" (Constitution Wrap)',
    description: 'Definir objetivo, comandos, estructura, estilo, testing y límites (Always/Ask/Never). Criterios EARS.',
    gateRequirement: 'Aprobación de spec + checklist constitution-grade (P1-P5).',
    artifact: 'SPEC.md o specs/<id>/PRODUCT.md',
    status: 'passed',
    checklist: [
      { id: 'e1_1', text: 'Scope check realizado (Capability map si >1 módulo)', completed: true },
      { id: 'e1_2', text: 'Criterios de aceptación en notación EARS (WHEN/THEN)', completed: true },
      { id: 'e1_3', text: 'Límites explícitos definidos: Always, Ask, Never', completed: true },
      { id: 'e1_4', text: 'P1-P5 Constitution checklist validado', completed: true },
    ]
  },
  {
    id: 'E2',
    name: 'E2 PLAN',
    tagline: 'Plan técnico de arquitectura',
    description: 'Mapeo de módulos, APIs, flujo de datos, invariantes de comportamiento y estrategia de testing.',
    gateRequirement: 'Aprobación del plan técnico con dependencias acotadas.',
    artifact: 'tasks/plan.md o specs/<id>/TECH.md',
    status: 'passed',
    checklist: [
      { id: 'e2_1', text: 'Contexto de codebase analizado', completed: true },
      { id: 'e2_2', text: 'Propuesta de arquitectura y módulos sin ciclos', completed: true },
      { id: 'e2_3', text: 'Invariantes mapeados a tests concretos', completed: true },
    ]
  },
  {
    id: 'E3',
    name: 'E3 TASKS',
    tagline: 'Descomposición atómica',
    description: 'Tareas completables en 1 sesión, con criterio de aceptación, paso de verificación y ≤5 archivos/tarea.',
    gateRequirement: 'Lista de tareas ordenada por dependencia verificable.',
    artifact: 'tasks/todo.md o specs/<id>/TASKS.md',
    status: 'passed',
    checklist: [
      { id: 'e3_1', text: 'Cada tarea afecta a ≤5 archivos', completed: true },
      { id: 'e3_2', text: 'Paso de verificación automatizado por tarea', completed: true },
      { id: 'e3_3', text: 'Dependencias explícitas secuenciadas', completed: true },
    ]
  },
  {
    id: 'E4',
    name: 'E4 IMPLEMENT',
    tagline: 'Ejecución con rigor ISTQB',
    description: 'Implementar código y tests cubriendo las 4 categorías: Válido, Límite, Inválido y Error de sistema.',
    gateRequirement: 'Código implementado con tests exhaustivos sin omitir happy-path ni bordes.',
    artifact: 'Código fuente + tests unitarios/integración',
    status: 'passed',
    checklist: [
      { id: 'e4_1', text: 'Partición de equivalencia y valores límite cubiertos', completed: true },
      { id: 'e4_2', text: 'Máquina de estados cerrada y transiciones válidas', completed: true },
      { id: 'e4_3', text: 'Cero filtrado de información interna en errores (P4)', completed: true },
    ]
  },
  {
    id: 'E5',
    name: 'E5 VERIFY',
    tagline: 'Evidencia real, no promesas',
    description: 'Ejecución real de suites de test, benchmarks, linter y compilador con exit code 0.',
    gateRequirement: 'Evidencia comprobada en log: test suite exit code 0.',
    artifact: 'Reporte de verificación con logs de tests',
    status: 'in_progress',
    checklist: [
      { id: 'e5_1', text: 'Compilación y typecheck sin advertencias fatales', completed: true },
      { id: 'e5_2', text: 'Tests ejecutados localmente con exit code 0', completed: false },
      { id: 'e5_3', text: 'Auditoría de rendimiento y tiempos de respuesta', completed: false },
    ]
  },
  {
    id: 'E6',
    name: 'E6 SHIP',
    tagline: 'Publicación limpia y segura',
    description: 'Commits convencionales, cero secretos en repo, branch protegida y despliegue a producción.',
    gateRequirement: 'CI hygiene en verde y URL verificada respondiendo HTTP 200.',
    artifact: 'Commit en main + deploy URL verificado',
    status: 'pending',
    checklist: [
      { id: 'e6_1', text: 'Auditoría de higiene CI: Cero secretos o credenciales', completed: false },
      { id: 'e6_2', text: 'Commits convencionales feat/fix/chore formateados', completed: false },
      { id: 'e6_3', text: 'Despliegue a producción respondiendo 200 OK', completed: false },
    ]
  },
  {
    id: 'E7',
    name: 'E7 LEARN',
    tagline: 'Memoria y retroalimentación',
    description: 'Cerrar sesión, registrar aprendizajes del ciclo, actualizar documentación viva del proyecto.',
    gateRequirement: 'Documentación sincronizada y lecciones aprendidas añadidas.',
    artifact: 'SPEC.md actualizado + CHANGELOG.md',
    status: 'pending',
    checklist: [
      { id: 'e7_1', text: 'Actualización de especificación viviente', completed: false },
      { id: 'e7_2', text: 'Registro de deuda técnica resuelta o identificada', completed: false },
      { id: 'e7_3', text: 'Cierre de ciclo de trabajo y retroalimentación', completed: false },
    ]
  }
];

const PRINCIPLES: SDDPrinciple[] = [
  {
    code: 'P1',
    name: 'ISTQB-FIRST',
    desc: 'Toda especificación debe aplicar 4 técnicas formales de pruebas para garantizar cobertura completa.',
    techniques: ['Partición de Equivalencia', 'Valores Límite', 'Tabla de Decisión', 'Transición de Estados'],
    enforcement: 'Obligatorio en E1 Spec y E4 Implement',
  },
  {
    code: 'P2',
    name: 'ZERO HAPPY-PATH-ONLY',
    desc: 'Prohibido probar únicamente el camino feliz. El sistema debe responder de forma predecible ante cualquier escenario.',
    techniques: ['Caso Típico Válido', 'Casos Límite / Extremos', 'Entrada Inválida / Malformada', 'Error de Sistema / Timeout'],
    enforcement: 'Mínimo 4 categorías por funcionalidad',
  },
  {
    code: 'P3',
    name: 'STATES EXPLICIT',
    desc: 'Conjunto cerrado de estados finitos. Toda transición permitida y prohibida debe estar formalmente justificada.',
    techniques: ['FSM exhaustiva', 'Prohibición de estados indefinidos', 'Transiciones unidireccionales'],
    enforcement: 'Enums y tipos estrictos en TypeScript',
  },
  {
    code: 'P4',
    name: 'ERROR LEAKAGE FORBIDDEN',
    desc: 'Los errores expuestos a clientes/usuarios nunca deben revelar esquemas internos, queries SQL, stacks o tokens.',
    techniques: ['Mensajes genéricos en UI', 'Logs estructurados seguros en servidor', 'Sanitización de respuestas'],
    enforcement: 'Middleware centralizado de errores',
  },
  {
    code: 'P5',
    name: 'GATEKEEPING BEFORE CODE',
    desc: 'Ninguna línea de código de producción se escribe antes de que la especificación y los criterios de gate estén aprobados.',
    techniques: ['Gate Clarify antes de Plan', 'Constitution Checklist antes de Implement', 'Cero asunciones'],
    enforcement: 'Etapas secuenciales E0 → E7',
  },
];

export const SddMaestroView: React.FC<Props> = ({ lang }) => {
  const [stages, setStages] = useState<SDDStage[]>(DEFAULT_STAGES);
  const [selectedStageId, setSelectedStageId] = useState<SDDStageId>('E1');
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  const selectedStage = stages.find((s) => s.id === selectedStageId) || stages[0];

  const toggleChecklistItem = (stageId: SDDStageId, itemId: string) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage;
        const newChecklist = stage.checklist.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const allCompleted = newChecklist.every((item) => item.completed);
        const anyCompleted = newChecklist.some((item) => item.completed);
        const newStatus = allCompleted ? 'passed' : anyCompleted ? 'in_progress' : 'pending';
        return { ...stage, checklist: newChecklist, status: newStatus };
      })
    );
  };

  const handleExportSpec = () => {
    const specMarkdown = `# SPEC: Belentani SDD Maestro Specification Sheet
Generado: ${new Date().toISOString()}
Ecosistema: belentani7 | Protocolo: E0-E7 SDD

## 🏛️ CONSTITUCIÓN ISTQB-FIRST
${PRINCIPLES.map((p) => `- **${p.code} ${p.name}**: ${p.desc}`).join('\n')}

## 🚪 ESTADO DE ETAPAS Y GATES
${stages
  .map(
    (s) => `### [${s.status.toUpperCase()}] ${s.name} — ${s.tagline}
- **Gate**: ${s.gateRequirement}
- **Artefacto**: ${s.artifact}
- **Criterios**:
${s.checklist.map((c) => `  - [${c.completed ? 'x' : ' '}] ${c.text}`).join('\n')}
`
  )
  .join('\n')}
`;

    const blob = new Blob([specMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SDD-SPEC-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    const passedCount = stages.filter((s) => s.status === 'passed').length;
    const text = `Belentani SDD Protocol: ${passedCount}/8 Stages Passed (${Math.round((passedCount / 8) * 100)}%)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">{t.sddTitle}</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">{t.sddSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{copied ? 'Copiado' : 'Copiar Resumen'}</span>
          </button>
          <button
            onClick={handleExportSpec}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.sddExportReport}</span>
          </button>
        </div>
      </div>

      {/* 8-Stage Pipeline Breadcrumb */}
      <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] gap-2">
          {stages.map((stage, idx) => {
            const isSelected = stage.id === selectedStageId;
            const isPassed = stage.status === 'passed';
            const isInProgress = stage.status === 'in_progress';

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => setSelectedStageId(stage.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1 ${
                    isSelected
                      ? 'bg-zinc-800 border-2 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'hover:bg-zinc-800/60 border border-transparent'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                      isPassed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isInProgress
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4" /> : stage.id}
                  </div>
                  <span className={`text-[11px] font-semibold truncate max-w-[90px] ${
                    isSelected ? 'text-white' : 'text-zinc-400'
                  }`}>
                    {stage.name}
                  </span>
                  <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full font-mono ${
                    isPassed ? 'text-emerald-400 bg-emerald-950/60' :
                    isInProgress ? 'text-amber-400 bg-amber-950/60' : 'text-zinc-500 bg-zinc-800'
                  }`}>
                    {stage.status.replace('_', ' ')}
                  </span>
                </button>
                {idx < stages.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Selected Stage Detail & Gatekeeper Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Stage Inspector (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400 tracking-wider">
                  STAGE DETAILS
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {selectedStage.name} — {selectedStage.tagline}
                </h3>
                <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                  {selectedStage.description}
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                selectedStage.status === 'passed'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : selectedStage.status === 'in_progress'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}>
                {selectedStage.status.replace('_', ' ')}
              </span>
            </div>

            {/* Gate Requirement & Artifact Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-zinc-800">
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                <span className="text-[11px] font-mono font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Gate Requirement
                </span>
                <p className="text-xs text-zinc-300 leading-normal">
                  {selectedStage.gateRequirement}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                <span className="text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> Mandatory Artifact
                </span>
                <p className="text-xs font-mono text-zinc-300 truncate">
                  {selectedStage.artifact}
                </p>
              </div>
            </div>

            {/* Interactive Stage Checklist */}
            <div className="space-y-3 pt-3 border-t border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Criterios de Aprobación de Gate
              </span>
              <div className="space-y-2">
                {selectedStage.checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(selectedStage.id, item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      item.completed
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        item.completed
                          ? 'bg-emerald-500 text-black'
                          : 'border border-zinc-600'
                      }`}
                    >
                      {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-medium flex-1">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Constitution Principles (1 col) */}
        <div className="space-y-4">
          <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {t.sddPrinciples}
              </h4>
            </div>

            <div className="space-y-3">
              {PRINCIPLES.map((principle) => (
                <div
                  key={principle.code}
                  className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {principle.code}
                    </span>
                    <span className="text-xs font-bold text-zinc-200">
                      {principle.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {principle.desc}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {principle.techniques.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
