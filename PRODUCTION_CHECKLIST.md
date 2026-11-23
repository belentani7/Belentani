# CHECKLIST PRODUCCIÓN — Criterios máximos para proyecto completo, seguro, estable en Internet

## 📋 Matriz de Criterios Obligatorios (Todos = ✅ requerido)

| # | Categoría | Criterio | Verificación | Severidad |
|---|-----------|----------|--------------|-----------|
| **1** | **Repo & Git** | `origin` remoto → GitHub `belentani7/<repo>` | `git remote -v` | 🔴 Crítico |
| **2** | **Repo & Git** | Branch `main` protegida (PR required, status checks) | GitHub Branch Protection | 🔴 Crítico |
| **3** | **Repo & Git** | Commits convencionales (`feat:`, `fix:`, `chore:`, `docs:`) | `git log --oneline` | 🟡 Alto |
| **4** | **Repo & Git** | `.gitignore` completo (node_modules, .env, dist, *.log, *.lock) | `cat .gitignore` | 🔴 Crítico |
| **5** | **Seguridad** | **Cero secretos en repo** (keys, tokens, passwords) | `git log --all --full-history --oneline -- **/.env*` = vacío | 🔴 Crítico |
| **6** | **Seguridad** | Dependabot / Renovate activado | GitHub Security tab | 🟡 Alto |
| **7** | **Seguridad** | CodeQL / Code scanning activado | GitHub Security tab | 🟡 Alto |
| **8** | **Seguridad** | `package-lock.json` / `pnpm-lock.yaml` commiteado | `ls -la *lock*` | 🟢 Medio |
| **9** | **Build** | `package.json` con scripts: `build`, `dev`, `start`, `test`, `lint`, `typecheck` | `cat package.json \| jq .scripts` | 🔴 Crítico |
| **10** | **Build** | Build local pasa sin errores (`pnpm build` / `npm run build`) | Exit code 0 | 🔴 Crítico |
| **11** | **Build** | TypeScript strict mode (`"strict": true`) | `cat tsconfig.json \| jq .compilerOptions.strict` | 🟡 Alto |
| **12** | **Build** | Lint pasa (`pnpm lint` / `npm run lint`) | Exit code 0 | 🟡 Alto |
| **13** | **Tests** | Tests existen y pasan (`pnpm test` / `npm test`) | Exit code 0, coverage > 80% | 🟡 Alto |
| **14** | **Deploy** | Config de deploy detectada (vercel.json / netlify.toml / wrangler.toml / Dockerfile) | `ls *.json *.toml Dockerfile` | 🔴 Crítico |
| **15** | **Deploy** | Deploy a plataforma correcta (matriz multistack-deploy) | URL live responde 200 | 🔴 Crítico |
| **16** | **Deploy** | Variables de entorno en plataforma (NO en repo) | Dashboard Vercel/Netlify/CF | 🔴 Crítico |
| **17** | **Deploy** | Preview deployments en PRs | GitHub Checks en PR | 🟢 Medio |
| **18** | **Runtime** | Health endpoint (`/api/health` o `/healthz`) responde 200 | `curl -I https://<url>/api/health` | 🟡 Alto |
| **19** | **Runtime** | Error tracking (Sentry / Vercel Analytics / CF Analytics) | Dashboard | 🟢 Medio |
| **20** | **Runtime** | Logs estructurados (pino / winston / console JSON) | Código | 🟢 Medio |
| **21** | **Performance** | Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms | Lighthouse / Vercel Speed Insights | 🟢 Medio |
| **22** | **Performance** | Assets con cache headers (static: 1 año, HTML: no-cache) | `curl -I /assets/*` | 🟢 Medio |
| **23** | **SEO/Access** | `robots.txt`, `sitemap.xml`, meta tags Open Graph/Twitter | `curl /robots.txt` | 🟢 Medio |
| **24** | **SEO/Access** | Accesibilidad: WCAG 2.1 AA (axe-core en CI) | `npm run test:a11y` | 🟢 Medio |
| **25** | **Docs** | `README.md` con: descripción, install, run, deploy, env vars, links vivos | `cat README.md` | 🟡 Alto |
| **26** | **Docs** | `CHANGELOG.md` o `CHANGES.md` actualizado | `cat CHANGELOG.md` | 🟢 Medio |
| **27** | **Docs** | `SPEC.md` o `docs/spec.md` con criterios de aceptación | `cat SPEC.md` | 🟢 Medio |
| **28** | **Infra** | DNS configurado (dominio custom + SSL) | `dig +short <dominio>` | 🟢 Medio |
| **29** | **Infra** | CDN / Edge activado (Vercel Edge, CF Pages, Netlify Edge) | Dashboard | 🟢 Medio |
| **30** | **Monitoring** | Uptime monitor (UptimeRobot / BetterUptime / Vercel) | Dashboard | 🟢 Medio |

---

## 🎯 Niveles de Cumplimiento

| Nivel | Criterios | Uso |
|-------|-----------|-----|
| **Nivel 0 — Mínimo viable** | 1, 4, 5, 9, 10, 14, 15, 16, 18, 25 | Prototipo interno |
| **Nivel 1 — Producción básica** | Nivel 0 + 2, 3, 6, 8, 11, 12, 13, 17, 23 | App pública simple |
| **Nivel 2 — Producción robusta** | Nivel 1 + 7, 19, 20, 21, 22, 24, 26, 27, 28, 29, 30 | App crítica / SaaS |

---

## 🤖 Automatización (Script de Auditoría)

```bash
# Ejecutar auditoría completa
python tools/audit-production-readiness.py --repo <path> --level 2
```

---

## 📦 Aplicación Masiva (Este Workspace)

**Proyectos detectados:**
1. `judas-experience-web` — Static Three.js site → Vercel (vercel.json creado)
2. `belentani-unified-master` — Fullstack eduforge → Netlify + Functions
3. `secure-t` / `secure-t-university` — Ya en matriz multistack-deploy
4. `belentani-omega-v2`, `BELENTANI-OS`, `belentani_Omega` — Revisar configs
5. `saas-plasma` — SaaS starter → Railway/Vercel
6. `canva-clone`, `paperclip-app`, `willian-games` — Frontend → Vercel/Netlify
7. `deepseek-harness`, `ollama`, `Meta-voicebox`, `SongGeneration*` — Backend/ML → Railway/Docker

---

## ✅ Próximo Paso: Aplicar a TODOS

Ejecuta: `python tools/apply-production-checklist.py --all --level 2 --push --deploy`