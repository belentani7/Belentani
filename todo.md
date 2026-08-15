# Project TODO: PAEA Supra-Kernel

## Completado

- [x] Análisis inicial y arquitectura base.
- [x] Definición de módulos y ADRs.
- [x] Desarrollo de endpoints de API y WebSockets.
- [x] Protocolo de seguridad y persistencia de 300 reglas documentado.
- [x] Motor de ingresos autónomos y scraping avanzado documentado.
- [x] Prompt Maestro de 1000 palabras redactado.
- [x] Especificación técnica final y PDF compilados.
- [x] Núcleo PVC-U L0-L8 implementado.
- [x] Persistencia PVC-U y migraciones aplicadas para tenants, perfiles, validaciones, evidencias y excepciones; la transacción atómica queda como deuda técnica.
- [x] Router tRPC PVC-U y aislamiento por owner/tenant verificados con pruebas de usuario, administrador y doble Drizzle controlado; E2E contra MySQL queda como deuda técnica.
- [x] Panel operativo PVC-U integrado en alcance básico; consume tRPC real y maneja autenticación, carga, error y vacío; cobertura avanzada permanece documentada como deuda técnica.
- [x] Pruebas core, TypeScript y build ejecutados con éxito.
- [x] Dependencias directas de alta prioridad actualizadas: axios, drizzle-orm y Vite.

## Auditoría final en curso

- [x] Auditar directamente `server/pvcu-core.ts`, `server/pvcu-db.ts` y `server/routers/pvcu.ts`.
- [x] Probar aislamiento por `ownerOpenId` y `tenantKey` con casos de usuario y administrador.
- [x] Probar persistencia y alcance de consultas PVC-U con dobles controlados y sin datos sensibles; falta prueba E2E contra DB real.
- [x] Implementar o acotar explícitamente la persistencia de `pvc_evidence` y `pvc_exceptions`.
- [x] Documentar qué capacidades del panel PVC-U son operativas y cuáles son parciales.
- [x] Documentar hallazgos, remediaciones y riesgos residuales.
- [x] Revisar dependencias, secretos rastreados, logs actuales y artefactos de build; se documentó el riesgo de cabeceras en logs de red de desarrollo.
- [ ] Confirmar que el contenido del repositorio GitHub coincide con el checkpoint final.
- [ ] Crear checkpoint final después de cerrar las verificaciones.
- [ ] Sincronizar la versión auditada con `belentani7/belentani-099`.
- [ ] Cambiar el repositorio indicado a privado como último paso.
- [ ] Confirmar mediante GitHub API la rama, commit y visibilidad finales.

## Criterios de salida

- [x] `pnpm check` sin errores.
- [x] `pnpm test --run` con todas las pruebas pasando.
- [x] `pnpm build` completado.
- [x] Sin secretos, claves o `.env` rastreados.
- [x] Aislamiento PVC-U demostrado por pruebas.
- [ ] Checkpoint final guardado.
- [ ] Push remoto verificado.
- [ ] Repositorio privado confirmado.

## Deuda técnica documentada

- La auditoría de dependencias aún puede mostrar vulnerabilidades transitivas o de desarrollo; se deben clasificar por exposición real y no presentarlas como resueltas sin actualización verificable.
- Los errores antiguos visibles en logs históricos de `server/db.ts` no deben considerarse activos si no se reproducen en el estado actual; se requiere una comprobación limpia del runtime.
- La validación criptográfica implementada genera hashes de evidencia, pero no equivale por sí sola a firma digital, WORM físico ni certificación de cumplimiento.
- La publicación en GitHub y el cambio de visibilidad quedan pendientes hasta completar las pruebas y el checkpoint final.

## Historial de control

Las tareas repetitivas generadas durante iteraciones anteriores se consolidan aquí para mantener un backlog verificable. No se marcará ningún punto como completado sin evidencia reproducible.
