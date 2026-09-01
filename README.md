# NOIACORE LAB — Belentani Digital Platform

[![Build](https://img.shields.io/github/actions/workflow/status/belentani7/belentani-099/ci.yml?branch=main&label=build)](https://github.com/belentani7/belentani-099/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/belentani7/belentani-099)](./LICENSE)
[![Deploy](https://img.shields.io/github/deployments/belentani7/belentani-099/production?label=deploy)](https://belentani.vercel.app)

> Catálogo, agente IA, automatización y observabilidad — plataforma digital de Pedro Belentani.

## Tech stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 · TypeScript · Vite 7 · Tailwind 4 · shadcn/ui · Framer Motion |
| Backend | Express · tRPC · Drizzle ORM · MySQL |
| Infra | pnpm · Vitest · GitHub Actions · Vercel |
| IA | LLM agent con fallback, streaming y revisión humana |

## Quick start

```bash
pnpm install
pnpm dev
```

La app arranca en `http://localhost:3000`.

Para construir en producción:

```bash
pnpm build
pnpm start
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Servidor de desarrollo con hot reload |
| `pnpm build` | Build de producción (Vite + esbuild) |
| `pnpm check` | Typecheck sin emitir archivos |
| `pnpm lint` | Prettier check |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm db:push` | Generar y aplicar migraciones Drizzle |

## Estructura

```
client/          → React SPA (páginas, componentes, rutas)
server/          → Express + tRPC routers, DB, middleware
server/_core/    → Bootstrap del servidor, Vite dev proxy
shared/          → Schemas y tipos compartidos cliente-servidor
drizzle/         → Migraciones y schema de base de datos
docs/            → Documentación de arquitectura y auditorías
```

## Screenshots

| Página | Captura |
|--------|---------|
| Home | ![Home](docs/screenshots/home.png) |
| Catálogo | ![Catálogo](docs/screenshots/catalogo.png) |
| Agente IA | ![Agente](docs/screenshots/agente.png) |

## Documentación

La arquitectura detallada, auditorías de seguridad, accesibilidad y decisiones de diseño están en [`/docs`](./docs/).

## Licencia

[MIT](./LICENSE)
