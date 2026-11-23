# belentani-workspace

Espacio de trabajo de Pedro Belentani (`belentani7`). Repositorio **privado**.

Aquí vive configuración de editor, automatización de GitHub y scripts de
mantenimiento del equipo. **No** contiene código de aplicación, ni documentos
personales, ni historiales de sesión: cada proyecto tiene su propio repositorio.

## 📦 Contenido

22 ficheros versionados:

| Ruta | Qué es |
|---|---|
| `.gitignore` | Exclusiones: secretos, documentos personales, medios |
| `.editorconfig` | Formato de código y fin de línea |
| `.vscode/` | 7 ficheros de extensiones, launch y tareas por lenguaje |
| `.github/workflows/ci.yml` | Auditoría de higiene en cada push y PR |
| `.github/pull_request_template.md` | Plantilla de pull request |
| `README.md`, `CONTRIBUTING.md`, `SECURITY.md` | Documentación del repositorio |
| `PRODUCTION_CHECKLIST.md` | Criterios de publicación de un proyecto |
| `PROTOCOLO-SDD-MAESTRO.md`, `PROTOCOLO_COMPLETO_BELENTANI_VISUAL_ENGINE.md` | Método de trabajo |
| `WinPurge.ps1`, `fix-keyboard-p30.ps1`, `test-teclado.ps1`, `mantenimiento.bat` | Scripts de mantenimiento de Windows |
| `.freebuff/project-id` | Identificador de proyecto Freebuff |

## 🔗 Clonar

```bash
git clone https://github.com/belentani7/belentani-workspace.git
```

## 🔍 Auditoría en CI

`.github/workflows/ci.yml` se ejecuta en cada push a `main` y en cada PR:

- **Bloqueante** — ningún fichero de credenciales trackeado (`.env`, `.pem`,
  `.p12`, `.pfx`, `id_rsa`, `id_ed25519`, `.keystore`, `.npmrc`, `.netrc`).
- **Bloqueante** — ningún patrón de credenciales en el contenido
  (claves de OpenAI, Google, AWS, Anthropic, Slack, claves PEM, tokens de GitHub).
- **Informativo** — JSON válido y HTML con `<title>` y meta description.

## 📋 Protocolo

Este repo sigue **protocolo-etapas (E0-E6)** — SDD para agentes:

1. **E0 Intake** → Entender
2. **E1 Spec** → Qué es "terminado"
3. **E2 Plan** → Tareas + dependencias
4. **E3 Build** → Ejecutar + verificar local
5. **E4 Verify** → Evidencia real (no promesas)
6. **E5 Ship** → Commit + Push + URL verificada
7. **E6 Learn** → Memoria + cerrar sesión

## 🌐 Idiomas

Orden fijo: **PT > ES > EN > CA** — `["pt","es","en","ca"]`

---

*Generado automáticamente via protocolo-etapas E5 Ship*
