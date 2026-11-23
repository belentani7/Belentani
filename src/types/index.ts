export type Language = 'pt' | 'es' | 'en' | 'ca';

export type GeneratorType = 
  | 'galaxy'
  | 'cyber_matrix'
  | 'landscape_biomes'
  | 'particle_vortex'
  | 'atmospheric_nebula'
  | 'monumental_architecture';

export type PaletteId = 
  | 'cyberpunk'
  | 'void_violet'
  | 'solar_flare'
  | 'emerald_matrix'
  | 'aurora_borealis'
  | 'monolith_gold';

export interface VisualEngineSettings {
  generator: GeneratorType;
  palette: PaletteId;
  speed: number;
  density: number;
  wireframe: boolean;
  bloomGlow: boolean;
  particleSize: number;
  rotationSpeed: number;
  seed: number;
  fieldOfView: number;
  ambientLight: number;
}

export type SDDStageId = 'E0' | 'E1' | 'E2' | 'E3' | 'E4' | 'E5' | 'E6' | 'E7';

export interface SDDStage {
  id: SDDStageId;
  name: string;
  tagline: string;
  description: string;
  gateRequirement: string;
  artifact: string;
  status: 'pending' | 'in_progress' | 'passed' | 'blocked';
  notes?: string;
  checklist: { id: string; text: string; completed: boolean }[];
}

export interface SDDPrinciple {
  code: string;
  name: string;
  desc: string;
  techniques: string[];
  enforcement: string;
}

export interface ChecklistCriterion {
  id: number;
  category: 'Repo & Git' | 'Seguridad' | 'Build' | 'Tests' | 'Deploy' | 'Runtime' | 'Performance' | 'SEO/Access' | 'Docs' | 'Infra' | 'Monitoring';
  name: string;
  verification: string;
  severity: 'Crítico' | 'Alto' | 'Medio';
  level: 0 | 1 | 2; // Level 0: MVP, Level 1: Basic, Level 2: Robust
  completed: boolean;
  notes?: string;
}

export interface WorkspaceProject {
  id: string;
  name: string;
  type: string;
  target: string;
  status: 'production' | 'active' | 'configured' | 'draft';
  description: string;
  tags: string[];
  repository?: string;
}

export interface WorkspaceScript {
  id: string;
  filename: string;
  language: string;
  description: string;
  purpose: string;
  codeSnippet: string;
}

export type NavTabId =
  | 'judas_omega'
  | 'omega_prime'
  | 'visual_engine'
  | 'sdd_maestro'
  | 'production_checklist'
  | 'workspace_hub';

export type CosmosFocusId = 'all' | 'planet' | 'machine' | 'key' | 'diamonds' | 'galaxy';

export type OmegaLayerId = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

export type OmegaCheckStatus = 'pending' | 'nominal' | 'degraded' | 'remediated';

export interface OmegaAxiom {
  id: string;
  number: string;
  title: string;
  summary: string;
  standard: string;
  verified: boolean;
}

export interface OmegaDiagnosticLayer {
  id: OmegaLayerId;
  layerLabel: string;
  title: string;
  diagnostics: string[];
  actions: string[];
  tools: string[];
  status: OmegaCheckStatus;
  findings: string;
}

export interface OmegaFixStep {
  step: number;
  code: string;
  title: string;
  objective: string;
  action: string;
  completed: boolean;
  notes: string;
}

export interface OmegaTargetProfile {
  platformName: string;
  stackPreset: string;
  symptomProfile: string;
  scaleGoal: string;
}

