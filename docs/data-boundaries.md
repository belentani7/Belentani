# Fronteras de datos y secretos

Belentani Studio mantiene una separación explícita entre contenido público, datos privados, instrucciones del agente y secretos operativos.

| Frontera           | Ubicación                                                                                | Regla                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Contenido público  | `catalog_items` aprobados/publicados, `media_resources` publicados, páginas públicas     | Solo se devuelve cuando el estado editorial y de publicación lo permiten; no contiene credenciales.                                      |
| Datos privados     | `users`, `email_drafts`, `automation_jobs`, métricas administrativas y colas editoriales | Se consultan mediante procedimientos protegidos; la UI no sustituye la autorización backend.                                             |
| Prompts y política | `server/agentPolicy.ts`                                                                  | Se mantienen en servidor; la política limita tamaño, historial, salida estructurada y revisión humana.                                   |
| Secretos           | `server/_core/env.ts`, variables de entorno gestionadas por la plataforma                | Nunca se escriben en código, cliente, logs, fixtures ni documentación; el cliente solo recibe configuración pública `VITE_*` autorizada. |
| Bytes multimedia   | Storage de objetos mediante `server/storage.ts`                                          | La base de datos conserva metadata y estado; los bytes no se guardan en columnas ni en el repositorio.                                   |

La frontera se aplica en el router: las consultas públicas filtran por estado publicado/aprobado; las mutaciones y consultas administrativas usan `adminProcedure`; el agente no ejecuta acciones externas y marca las solicitudes sensibles para revisión humana. Las métricas de negocio se agregan sin payloads textuales.

## Mapa módulo → dato → acceso

| Módulo                  | Datos que puede tocar                              | Nivel de acceso                                                                                               |
| ----------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `server/privateData.ts` | `email_drafts`                                     | Lectura y revisión administrativa; nunca se expone a procedimientos públicos.                                 |
| `server/db.ts`          | `users` y conexión Drizzle                         | Infraestructura server-side; no se importa desde el cliente.                                                  |
| `server/agentPolicy.ts` | Prompt, límites, categorías y decisión de revisión | Server-side puro; no recibe secretos ni persiste texto de usuario.                                            |
| `server/_core/env.ts`   | Variables de entorno y claves de proveedores       | Server-only; los valores no se serializan en respuestas.                                                      |
| `server/storage.ts`     | Bytes y URLs de objetos multimedia                 | Server-side; publica únicamente recursos cuya metadata ya está autorizada.                                    |
| `server/routers.ts`     | Orquestación de procedimientos                     | Aplica `publicProcedure`, `protectedProcedure` y `adminProcedure`; delega acceso privado a módulos dedicados. |
