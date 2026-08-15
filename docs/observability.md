# Observabilidad operativa

La plataforma usa `server/structuredLogger.ts` como frontera común para eventos estructurados. Cada entrada incluye `timestamp` ISO UTC, `level`, `event` y `context`; no se serializan cuerpos de correo, prompts, credenciales ni payloads sensibles.

| Área                 | Instrumentación                                                                                                                            | Persistencia o consulta                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Solicitudes y agente | `server/observability.ts` registra requests, respuestas, fallbacks y latencia acumulada                                                    | Agregado expuesto al panel administrativo mediante `metrics.public`. |
| Automatizaciones     | `server/_core/index.ts` registra inicio lógico, éxito, fallo y skip; `automation_runs` guarda estado, duración, task UID, snapshot y error | `admin.automationRuns`, ordenado por ejecución UTC.                  |
| Media                | `logError("media_upload_failed")` registra fallos sin bytes ni contenido                                                                   | Logs estructurados del servidor.                                     |
| Arranque             | `server/_core/index.ts` registra fallback de puerto, arranque y fallo de arranque                                                          | Logs estructurados del servidor.                                     |
| Negocio              | `business_events` conserva únicamente nombres allowlisted y fecha                                                                          | Agregados privados en administración.                                |

Los jobs no se activan desde desarrollo: `automationSetStatus` exige callback, task UID y entorno productivo. El callback es pausables, registra skips y conserva el snapshot del catálogo sin publicar cambios editoriales por sí mismo.
