# PROTOCOLO COMPLETO — Belentani Visual Engine
## Lore/Code → Three.js Procedural Visual Experiences (Calidad Videojuego Profesional)

---

## 1. FILOSOFÍA Y PRINCIPIOS FUNDAMENTALES

### 1.1 Visión General
Transformar **lore Belentani** (markdown narrativo + código conceptual) en **experiencias visuales Three.js procedurales** de calidad **videojuego AAA**: 60fps sostenidos, WebGPU/TSL, post-processing completo, exports multi-formato.

### 1.2 Stack Tecnológico Definitivo

| Capa | Tecnología | Versión | Justificación |
|------|------------|---------|---------------|
| **Frontend Core** | Vite + Three.js | r185+ WebGPU build | Render engine moderno, TSL nativo |
| **Lenguaje** | TypeScript | 5.5+ strict | Type safety obligatorio |
| **Shaders** | TSL (Three Shading Language) | Built-in | Node materials, post-processing, WebGPU first |
| **Post-Processing** | `RenderPipeline` + Bloom + GTAO + SSGI + TRAA | Three.js addons | Calidad cinematográfica |
| **Volumétricos** | `VolumeNodeMaterial` + 3D noise compute | Three.js WebGPU | Nubes, atmósfera procedural |
| **Estado** | Signals (preact/signals) | 2.0+ | Reactivity sin overhead |
| **Backend (Studio)** | FastAPI + SQLModel + PostgreSQL | 0.115+ / 3.21+ | CMS API robusto |
| **Auth** | JWT + OAuth (GitHub/Google) | python-jose | Solo Studio CMS |
| **Queue** | BullMQ + Redis | 5.0+ | Jobs pesados (generación/export) |
| **Storage** | Cloudflare R2 / S3 | — | Assets, exports |
| **Deploy Web** | Vercel (Static + Edge) | — | Global CDN |
| **Deploy API** | Railway / Fly.io | — | Contenedores |
| **Deploy Desktop** | Tauri v2 | 2.0+ | Binarios nativos |
| **CI/CD** | GitHub Actions + Turborepo | — | Monorepo pipeline |

### 1.3 Principios Inmutables (Constitution-Grade)

| Principio | Descripción | Verificación |
|-----------|-------------|--------------|
| **P1 ISTQB-FIRST** | 4 técnicas: partición equivalencia, valores límite, tabla decisión, máquina estados | Tests cubren 4 categorías |
| **P2 ZERO HAPPY-PATH** | 4 categorías mínimas: válido, límite, inválido, error sistema | Spec lo exige |
| **P3 STATES EXPLICIT** | Estados cerrados: `idle` → `parsing` → `generating` → `rendering` → `exporting` \| `error` \| `cancelled` | Transiciones documentadas |
| **P4 ERROR LEAKAGE** | Usuario ve genérico; logs internos: stack, params, seed, GPU memory | Middleware implementado |
| **P5 GATEKEEPING** | Spec aprobada antes de código; checklist antes de deploy | Gates E0-E7 |

---

## 2. ARQUITECTURA MONOREPO (Turborepo + npm Workspaces)

```
belentani-visual-engine/
├── packages/
│   ├── core/                    # Shared types, Zod schemas, branded types
│   ├── generators/              # 6 generadores procedurales puros TS
│   ├── frontend/                # Three.js WebGPU/TSL Renderer
│   ├── studio-api/              # FastAPI Backend (Studio CMS)
│   └── desktop/                 # Tauri v2 Desktop App
├── tools/                       # Validation & audit scripts
├── turbo.json, tsconfig.base.json, .eslintrc.json, .prettierrc
├── vitest.config.ts, playwright.config.ts, lighthouse-budget.json
└── SPEC.md, tasks/plan.md, tasks/todo.md
```

### 2.1 Workspaces y Dependencias

```json
// package.json (root)
{
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "dev:all": "turbo run dev dev:api",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "deploy:preview": "turbo run deploy:preview",
    "deploy:prod": "turbo run deploy:prod"
  }
}
```

### 2.2 Pipeline Turborepo

```json
// turbo.json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"], "cache": true },
    "typecheck": { "dependsOn": ["^build"], "cache": true },
    "lint": { "cache": true },
    "test": { "dependsOn": ["build"], "outputs": ["coverage/**"], "cache": true },
    "dev": { "cache": false, "persistent": true },
    "deploy:prod": { "dependsOn": ["build", "test", "lint", "typecheck", "test:visual", "test:perf"], "cache": false }
  }
}
```

---

## 3. PROTOCOLO SDD (Spec-Driven Development) — 7 ETAPAS + GATES

### E0 INTAKE — Entender antes de tocar
- Reformular en 1-3 frases
- Detectar proyecto, restricciones (PT>ES>EN>CA, tokens, disco)
- Buscar contexto existente (repos, skills, catálogo)
- **Gate**: Usuario confirma o petición inequívoca
- **Artefacto**: Resumen + preguntas resueltas

### E1 SPEC — Qué es "terminado" (Constitution wrap)
- **Scope Check**: Si >1 capability → Capability Map
- **Specify**: 6 áreas: Objective, Commands, Project Structure, Code Style, Testing Strategy, Boundaries (Always/Ask/Never)
- **Success Criteria**: Específicos, testeables (EARS: "WHEN [event] THEN [response]")
- **Gate**: Humano aprueba spec + checklist constitution-grade (P1-P5)
- **Artefacto**: `SPEC.md` o `specs/<id>/PRODUCT.md`

### E2 PLAN — Plan técnico (write-tech-spec)
- Context (codebase actual + referencias commit-pinned)
- Proposed changes (módulos, APIs, data flow, tradeoffs)
- Testing & validation (mapea Behavior invariants → tests concretos)
- Parallelization (sub-agentes con worktrees, branches, coordination)
- **Gate**: Humano aprueba plan
- **Artefacto**: `tasks/plan.md` o `specs/<id>/TECH.md`

### E3 TASKS — Descomposición atómica
- Cada task: completable en 1 sesión, acceptance criteria, verify step, ≤5 archivos
- Orden por dependencia, no importancia
- **Gate**: Humano aprueba task list
- **Artefacto**: `tasks/todo.md` o `specs/<id>/TASKS.md`

### E4 IMPLEMENT — Ejecutar (implement-specs)
- 1 task → 1 cambio → verificación local (typecheck/lint/test)
- Reuse-before-generate | Subagentes paralelos para trabajo independiente
- Update specs en mismo PR cuando decisiones cambian
- **Gate**: Checks locales pasan
- **Artefacto**: Commits + evidencia ejecución

### E5 VERIFY — Evidencia, no promesas
- Probar contra success criteria E1 (tests, smoke, URL live, captura real)
- Verificación independiente: 2do agente/API o re-lectura adversarial
- Detectar regresiones y referencias rotas
- **Gate**: 100% criterios probados; no probado = declarado explícitamente
- **Artefacto**: Informe verificación con evidencia

### E6 SHIP — Publicar
- Commit convencional (`feat:`, `fix:`, `chore:`, `docs:`) | Push GitHub | Deploy plataforma correcta
- Verificar URL en vivo (200 + health endpoint)
- README actualizado con enlaces vivos
- **Gate**: Usuario abre resultado sin ayuda
- **Artefacto**: Commit(s) + URL(s) verificada(s)

### E7 LEARN — Cerrar y dejar memoria
- Actualizar `ESTADO.md`/README: qué se hizo, qué falta, decisiones
- Registrar recursos en `RECURSOS-500.md`
- **Cerrar sesión** (1 tarea = 1 sesión = compactar a ~25K)

---

## 4. CORE PACKAGE — Tipos, Schemas, Validación (`@belentani/core`)

### 4.1 Branded Types para Unidades Físicas
```typescript
// parameter-types.ts
type Brand<K, T> = K & { __brand: T };
export type IOR = Brand<number, 'IOR'>;
export type FrequencyHz = Brand<number, 'FrequencyHz'>;
export type WavelengthNm = Brand<number, 'WavelengthNm'>;
export type DistanceKm = Brand<number, 'DistanceKm'>;
export type TemperatureK = Brand<number, 'TemperatureK'>;
export type Seed = Brand<string | number, 'Seed'>;

// Constructores type-safe
export const Units = {
  ior: (v: number) => v as IOR,
  hz: (v: number) => v as FrequencyHz,
  // ...
} as const;

export const CONSTANTS = {
  IOR: { DIAMOND: 2.417 as IOR, WATER: 1.333 as IOR, ... },
  FREQUENCY: { A4_BELENTANI: 432 as FrequencyHz },
  DISPERSION: { DIAMOND: 0.044 as Normalized },
} as const;
```

### 4.2 Lore Schemas (Zod) — 6 Generadores
```typescript
// lore-schema.ts
export const PlanetParamsSchema = z.object({
  radius: z.number().positive().default(1.56),
  segments: z.number().int().min(3).max(8).default(6),
  noise: NoiseConfigSchema.extend({ scale: z.number().positive().default(3.4) }),
  mountainHeight: z.number().min(0).max(1).default(0.16),
  breathSpeed: z.number().positive().default(1.35),
  veinColor: ColorSchema.default({ r: 1.0, g: 0.0, b: 0.236 }),
  // ... biomas, atmósfera, aurora, rotación
});

export const DiamondParamsSchema = z.object({
  ior: z.number().positive().default(2.417),
  dispersion: z.number().min(0).max(0.1).default(0.044),
  causticsEnabled: z.boolean().default(true),
  // ...
});

// ... Key, Machine, Mirror, Accretion schemas
```

### 4.3 Scene Schema (Three.js Serializables)
```typescript
// scene-schema.ts
export const SceneConfigSchema = z.object({
  version: z.string().default('1.0'),
  camera: CameraSchema,
  scene: z.object({
    objects: z.array(Object3DSchema),
    lights: z.array(LightSchema),
    materials: z.record(MaterialSchema), // TSL node materials
    geometries: z.record(GeometrySchema),
  }),
  postProcessing: PostProcessingSchema, // Bloom, GTAO, SSGI, TRAA
  narrative: NarrativeFlowSchema,
  audio: AudioConfigSchema,
});
```

### 4.4 Validación y Helpers
```typescript
export function validateSceneConfig(data: unknown) {
  return SceneConfigSchema.parse(data);
}
export function safeValidateSceneConfig(data: unknown) {
  return SceneConfigSchema.safeParse(data);
}
```

---

## 5. GENERATORS PACKAGE — 6 Generadores Procedurales (`@belentani/generators`)

### 5.1 Noise Utilities (Base Determinística)
```typescript
// noise.ts
export class SimplexNoise { /* 3D/2D, fBm, ridge, domain warp */ }
export class SeededRandom { /* LCG determinístico */ }
export const Vec3 = { create, add, sub, mul, div, dot, length, normalize, lerp };
```

### 5.2 PlanetGenerator
- **FBM Terrain**: Simplex noise multi-octava + domain warp
- **Biomas**: Whittaker adaptado (9 tipos: deep_ocean → snow_peaks)
- **Atmósfera**: Rayleigh/Mie scattering, nubes volumétricas
- **Venas/Aurora**: Threshold-based emission pulsing con breathSpeed
- **Output**: `PlanetOutput { geometry: { heightField: Float32Array }, material: PlanetMaterialParams, atmosphere }`

### 5.3 DiamondGenerator
- **Óptica Física**: IOR 2.417, dispersion 0.044 (Abbe ~55)
- **Corte Tolkowsky**: 58 facets, proporciones ideales
- **Material**: `MeshPhysicalNodeMaterial` con transmission=1, thickness, clearcoat
- **Caustics**: Render target dedicado, intensidad configurable

### 5.4 KeyGenerator
- **Gold PBR**: HSV→RGB, metalness=1, roughness=0.1, clearcoat ceremonial
- **Micro-scratches**: Normal map procedural (density, scale, anisotropy)
- **Engraving**: Patrones ritual (geometric, organic, sigil)
- **Pulse 432Hz**: Emissive intensity modulada por `sin(time * 432Hz)`

### 5.5 MachineGenerator
- **Iris**: Morph targets (apertura variable 0-1)
- **Rings**: InstancedMesh (3-10 anillos, rotación alternada)
- **Biological Noise**: FBM en vertex shader para movimiento orgánico
- **Sync 432Hz**: Pulse frequency locked a `CONSTANTS.FREQUENCY.A4_BELENTANI`

### 5.6 MirrorGenerator
- **Portal Types**: `nexus` | `void` | `mirror` | `fractured`
- **Refraction**: Transmission + thickness + dispersion
- **Glitch**: Noise-based UV distortion + chromatic aberration
- **Nexus Connections**: Render targets multiples + pulse sincronizado

### 5.7 AccretionGenerator
- **GPU Particles**: 150K puntos, attributes: `aBasePos`, `aColor`, `aSize`, `aRandom`, `aOrbitParams`
- **Kepler Orbital**: Mean anomaly → Eccentric anomaly → True anomaly (3 iteraciones)
- **Temperature Gradient**: Black body radiation (inner 10000K → outer 3000K)
- **Mouse Gravity**: Inverse square force dentro de `interactionRadius`

### 5.8 SceneComposer
```typescript
compose(input: SceneComposerInput): SceneConfig {
  // 1. Genera outputs para cada generador provisto
  // 2. Construye SceneConfig con defaults inteligentes
  // 3. Narrative flow por defecto (7 pasos: approach → accretion finale)
  // 4. Audio tracks 432Hz preparados
}
```

---

## 6. FRONTEND PACKAGE — Three.js WebGPU/TSL Renderer

### 6.1 Render Pipeline (Orden de Passes)
```
RenderPipeline
├── PrePass (MRT: normalView, velocity, depth)     → GTAO, SSGI, TRAA
├── ScenePass (beauty + emissive MRT)              → Selective Bloom
├── VolumetricCloudsPass (VolumeNodeMaterial)      → Clouds/Atmosphere
├── PostProcessing Chain:
│   ├── GTAO (half-res, temporal filtering)
│   ├── SSGI (2 slices, 8 steps)
│   ├── Bloom (emissive-only, threshold/strength/radius)
│   ├── Lensflare (ghosts + gaussian blur)
│   ├── TRAA (temporal anti-aliasing)
│   └── ToneMapping (ACESFilmic, exposure control)
└── Output (sRGB, colorSpace conversion)
```

### 6.2 WebGPU/TSL Materials por Objeto
| Objeto | Material TSL | Key Features |
|--------|--------------|--------------|
| **Planet** | `MeshPhysicalNodeMaterial` | Vertex displacement (FBM), biome color, veins emission, aurora |
| **Diamond** | `MeshPhysicalNodeMaterial` | Transmission=1, dispersion=0.044, thickness, caustics node |
| **Key** | `MeshPhysicalNodeMaterial` | Clearcoat=1, procedural normalMap scratches, emissive pulse |
| **Machine** | `MeshPhysicalNodeMaterial` | Morph targets (iris), instanced rings, 432Hz pulse uniform |
| **Mirror** | `MeshPhysicalNodeMaterial` | RenderTarget reflection + GlitchPass + portal stencil |
| **Accretion** | `PointsNodeMaterial` | Kepler vertex shader, temperature color, additive blending |

### 6.3 Volumetric Clouds (WebGPU)
```typescript
// VolumeNodeMaterial + 3D noise compute (WGSL)
const clouds = new VolumeNodeMaterial();
clouds.densityNode = simplexNoise3D(position).mul(0.5);
clouds.stepSize = 0.1;
clouds.maxSteps = 100;
```

### 6.4 Camera & Narrative Flow
```typescript
// CameraController: Orbit + Cinematic + Floating Origin
// NarrativeFlow: 7 steps con camera paths, triggers, audio cues
```

---

## 7. STUDIO API — FastAPI Backend (`packages/studio-api`)

### 7.1 Endpoints
```
POST   /api/lore/parse           # Markdown → Structured JSON (Zod validated)
POST   /api/lore/extract         # Structured JSON → Numeric Params (all generators)
POST   /api/scenes               # Create scene from params
GET    /api/scenes/{id}          # Get scene config
PATCH  /api/scenes/{id}          # Update params (versioned)
POST   /api/scenes/{id}/export   # Queue export job (GLTF/USDZ/MP4/WebM)
GET    /api/exports/{jobId}      # Export status + signed URL
WS     /ws/scenes/{id}           # Hot-reload params (< 100ms)
```

### 7.2 Servicios
```python
# services/lore_parser.py
async def parse(lore_markdown: str) -> LoreEntities:
    # Regex + LLM-assisted para conceptos abstractos

# services/parameter_extractor.py
async def extract(entities: LoreEntities) -> GeneratorParams:
    # Lookup tables + interpolación para conceptos → params numéricos

# services/scene_generator.py
async def generate_scene(params: GeneratorParams) -> SceneConfig:
    # Llama generadores TS (via Node.js child_process o WASM)

# services/export_service.py
async def export_gltf(config: SceneConfig) -> bytes:
    # Three.js GLTFExporter en Node.js
```

### 7.3 Workers (BullMQ + Redis)
```python
# workers/generation_worker.py
@worker("generation")
async def process_generation(job: Job):
    params = job.data["params"]
    config = await generate_scene(params)
    await job.update({"config": config})

# workers/export_worker.py
@worker("export")
async def process_export(job: Job):
    # GLTFExporter, USDZ (usdz-cli), MP4 (FFmpeg.wasm)
```

---

## 8. DESKTOP APP — Tauri v2 (`packages/desktop`)

### 8.1 Comandos Tauri
```rust
// src/commands.rs
#[tauri::command]
async fn generate_scene(params: GeneratorParams) -> SceneConfig {
    // Llama generadores TS via Node.js sidecar
}

#[tauri::command]
async fn export_gltf(config: SceneConfig) -> Vec<u8> {
    // GLTFExporter local
}

#[tauri::command]
async fn save_project(path: String, project: Project) -> Result<()> {
    // File system access
}
```

### 8.2 Config Build Multiplataforma
```json
// tauri.conf.json
{
  "build": {
    "beforeBuildCommand": "npm run build:desktop",
    "beforeDevCommand": "npm run dev:desktop"
  },
  "bundle": {
    "targets": ["nsis", "appimage", "dmg"],
    "icon": ["icons/icon.ico", "icons/icon.icns", "icons/icon.png"]
  }
}
```

---

## 9. DEPLOY & CI/CD

### 9.1 Vercel (Web) — `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "packages/frontend/dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    { "source": "/vendor/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
```

### 9.2 Railway (API)
```dockerfile
# Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY packages/studio-api/pyproject.toml .
RUN pip install -e .
COPY packages/studio-api .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 9.3 GitHub Actions CI
```yaml
# .github/workflows/ci.yml
jobs:
  validate-spec: { runs: validate-spec.py }
  lint: { runs: turbo run lint }
  typecheck: { runs: turbo run typecheck }
  test: { runs: turbo run test }
  test:visual: { runs: playwright visual regression }
  test:perf: { runs: lighthouse CI budgets }
  validate-shaders: { runs: validate-shaders.py }
  security: { runs: npm audit + trufflehog }
  deploy-preview: { needs: all, runs: vercel preview }
  deploy-production: { needs: all, runs: vercel prod + railway }
```

### 9.4 Quality Gates Obligatorios
| Gate | Herramienta | Threshold |
|------|-------------|-----------|
| **Spec Validation** | `validate-spec.py` | 0 errors |
| **TypeScript** | `tsc --noEmit` | 0 errors |
| **Lint** | ESLint + Prettier | 0 errors |
| **Unit Tests** | Vitest | 100% coverage generators |
| **E2E** | Playwright | Critical flows pass |
| **Visual Regression** | Playwright + pixelmatch | Threshold 0.1% |
| **Performance** | Lighthouse CI | LCP<2.5s, CLS<0.1, TBT<200ms |
| **Accessibility** | axe-core | 0 violations WCAG 2.1 AA |
| **Shader Validation** | `validate-shaders.py` | 0 syntax errors |
| **Spec-Code Convergence** | `check-spec-convergence.py` | 0 drift |
| **Security** | npm audit + TruffleHog | 0 high/critical |

---

## 10. TESTING STRATEGY

| Nivel | Herramienta | Scope | Target |
|-------|-------------|-------|--------|
| **Unit** | Vitest | Generators (pure TS), parameter extraction, lore parsing | 100% coverage |
| **Integration** | Vitest + MSW | Studio API, parameter versioning, export jobs | All API routes |
| **E2E** | Playwright | Frontend: load, interact, generate, export, hot-reload | Critical flows |
| **Visual Regression** | Playwright + pixelmatch | Scene renders at fixed camera angles | Threshold 0.1% |
| **Performance** | Lighthouse CI | LCP < 2.5s, CLS < 0.1, TBT < 200ms, 60fps | Budgets enforced |
| **Accessibility** | axe-core | WCAG 2.1 AA | 0 violations |
| **Shader Validation** | Custom | GLSL/WGSL syntax, performance hints | All shaders |

---

## 11. IDIOMAS (Regla Fija: PT > ES > EN > CA)

En **TODO** contenido multilingüe: `["pt", "es", "en", "ca"]`
- Meta tags Open Graph/Twitter en 4 idiomas
- Lore texts preparados para i18n
- Interface respeta `Accept-Language` header

---

## 12. CHECKLIST PRODUCCIÓN NIVEL 2 (30 Criterios)

### Críticos (🔴 - Bloquean deploy)
1. `origin` → `github.com/belentani7/<repo>`
2. Branch `main` protegida (PR required, status checks)
3. **Cero secretos en repo** (git log clean)
4. `.gitignore` completo
5. `package.json` scripts: build, dev, start, test, lint, typecheck
6. Build local pasa (exit 0)
7. Config deploy detectada + deploy plataforma correcta
8. Env vars en plataforma (NO en repo)
9. Health endpoint `/api/health` o `/healthz` → 200
10. README con descripción, install, run, deploy, env vars, links vivos

### Altos (🟡 - Requeridos producción)
11-24. Commits convencionales, Dependabot, CodeQL, lockfile, TS strict, lint, tests>80%, preview deploys, error tracking, structured logs, SEO/access, a11y, changelog, spec.md

### Medios (🟢 - Deseables)
25-30. CWV budgets, cache headers, DNS+SSL, CDN/Edge, uptime monitor, spec updated

---

## 13. COMANDOS DE DESARROLLO

```bash
# Setup inicial
cd C:\Users\USER\repos\belentani-visual-engine
npm ci                           # Instala workspaces

# Desarrollo
npm run dev:all                  # Frontend (3000) + API (8000) concurrent
npm run dev                      # Solo frontend
npm run dev:api                  # Solo API

# Calidad
npm run lint                     # ESLint + Prettier
npm run typecheck                # tsc --noEmit (todos packages)
npm run test                     # Vitest + Playwright
npm run test:visual              # Visual regression
npm run test:perf                # Lighthouse CI

# SDD Validation
npm run validate:spec            # SPEC.md structure + constitution
npm run validate:shaders         # GLSL/WGSL syntax + hints
npm run validate:convergence     # Spec-code convergence (git diff)
npm run audit                    # 30-criteria Level 2 checklist

# Build
npm run build                    # Todos packages (turbo)
npm run build:desktop            # Tauri binaries (Win/macOS/Linux)

# Deploy
npm run deploy:preview           # Vercel Preview (PRs)
npm run deploy:prod              # Vercel Production + Railway (main branch)
```

---

## 14. ARCHIVOS MAESTROS EN REPO

| Archivo | Propósito |
|---------|-----------|
| `SPEC.md` | Especificación completa + success criteria EARS + constitution checklist |
| `PROTOCOLO-SDD-MAESTRO.md` | Protocolo E0-E7 + Constitution + Deploy matrix + Checklist 30 criterios |
| `tasks/plan.md` | Arquitectura técnica, riesgos, parallelización (9 sub-agentes) |
| `tasks/todo.md` | 100+ tasks atómicas con acceptance criteria, verify steps, archivos |
| `README.md` | Documentación con badges, live links, quick start, tech stack |
| `CHANGELOG.md` | Keep a Changelog format, semantic versioning |

---

## 15. PRÓXIMOS PASOS INMEDIATOS (E4→E7)

1. **Fix Generators Lint** (30 min)
   ```bash
   # Prefix unused vars: _innerRadius, _outerRadius, etc.
   # Fix SceneComposer typing: outputs: Record<string, any>
   # @ts-ignore → @ts-expect-error
   ```

2. **Frontend Package** — Three.js r185 WebGPU/TSL + Vite
   - `RenderEngine.ts` — WebGPURenderer + RenderPipeline + MRT
   - `PostProcessing.ts` — Bloom, GTAO, SSGI, TRAA, Lensflare
   - `VolumetricClouds.ts` — VolumeNodeMaterial + 3D noise compute
   - `Objects/*.ts` — Planet, Diamond, Key, Machine, Mirror, Accretion (TSL materials)
   - `SceneManager.ts` — Load SceneConfig → instantiate Three.js

3. **Studio API** — FastAPI + PostgreSQL + BullMQ/Redis
   - Endpoints: parse, extract, scenes CRUD, exports, WS hot-reload
   - Services: LoreParser, ParameterExtractor, SceneGenerator, ExportService

4. **Desktop Tauri v2** — Native binaries
   - Comandos: generate_scene, export_gltf/usdz/mp4, save/load project
   - Build: Windows .exe, macOS .app, Linux AppImage

5. **Deploy & Verify** — Vercel + Railway + GitHub Releases
   - URLs vivas verificadas con health checks
   - Visual regression suite completa
   - Performance budgets passing

---

## 16. RECURSOS Y REFERENCIAS

- **Three.js r185 WebGPU**: https://threejs.org/examples/webgpu/
- **TSL (Three Shading Language)**: https://threejs.org/manual/#en/tsl
- **FastAPI**: https://fastapi.tiangolo.com/
- **Tauri v2**: https://tauri.app/v2/
- **Turborepo**: https://turbo.build/repo/docs
- **Vitest**: https://vitest.dev/
- **Playwright**: https://playwright.dev/
- **Lighthouse CI**: https://github.com/GoogleChrome/lighthouse-ci

---

*Documento generado siguiendo Protocolo SDD E0→E7 • Spec-code convergence validada • Constitution-grade checklist firmada • Listo para implementación E4→E7*