# Belentani Workspace & Visual Engine

Aplicación web interactiva de Pedro Belentani (`belentani7`): experiencia
**THE JUDAS EXPERIENCE // OMEGA** (Three.js, audio 432 Hz / 76 BPM, terminal IA
con Gemini), protocolo OMEGA-PRIME, Visual Engine procedural 3D, gatekeeper
SDD Maestro, auditor de producción y hub del workspace. Interfaz en
PT / ES / EN / CA.

## ▶️ Desarrollo

```bash
bun install          # o npm install
cp .env.example .env # GEMINI_API_KEY solo es necesaria para /api/lore
bun run dev          # servidor Express + Vite en http://0.0.0.0:3000
```

## 🧪 Verificación

```bash
bun run typecheck    # tsc --noEmit
bun run test         # Vitest: navegación, paridad i18n, integridad de datos
bun run test:e2e     # Playwright: camino feliz en navegador real (instala Chromium en CI)
bun run build        # tsc + vite build → dist/
```

En producción: `NODE_ENV=production node server.ts` sirve `dist/` con caché
inmutable de 1 año para assets y `no-cache` para el HTML. La vista de cada
pestaña se carga bajo demanda (`React.lazy` + chunks `vendor-three` /
`vendor-react`), así que el JS inicial es solo el de la vista activa.

## 📁 Estructura

| Ruta | Qué es |
|---|---|
| `src/App.tsx`, `src/components/` | SPA React 19 (6 vistas lazy) |
| `src/lib/navigation.ts` | Parsing de `?view=` e idioma persistido (testeado) |
| `src/locales/i18n.ts` | Traducciones pt/es/en/ca con paridad verificada por test |
| `server.ts` | API Express: `/api/health`, `/api/lore` (Gemini, rate-limit 30/min/IP) |
| `tests/`, `e2e/` | Suite Vitest y e2e Playwright |
| `archive/aistudio/` | HTML histórico de AI Studio (fuera de `public/`: no se despliega) |
| `.github/workflows/` | CI: higiene de secretos + typecheck/tests/build/e2e; deploy a Pages |
| `WinPurge.ps1`, `*.ps1`, `mantenimiento.bat` | Scripts de mantenimiento de Windows |

## 🌐 Idiomas

Orden fijo: **PT > ES > EN > CA** — `["pt","es","en","ca"]` (por defecto `es`).

---
*Protocolo de trabajo: protocolo-etapas E0–E6 (ver documentos de protocolo en la raíz).*
