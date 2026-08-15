# Belentani Studio — Arquitectura inicial

## Identidad

Belentani Studio es una plataforma digital firmada por **Pedro Belentani**. La experiencia se construye alrededor de una percepción editorial, precisa y humana: agrupación Gestalt, contraste controlado, jerarquía tipográfica, proximidad semántica, continuidad visual y reducción deliberada del ruido.

La presencia oficial indicada es [belentani.eu](https://belentani.eu), el proyecto relacionado [noiacore.com](https://noiacore.com), la red social `@belentani_` y el correo `belentani7studio@proton.me`.

## Arquitectura funcional

La plataforma se divide en una capa pública de marca, un catálogo paginado, recursos multimedia, un agente conversacional, automatizaciones observables, gestión de correo con revisión humana, panel privado con roles, analítica y changelog público.

La aplicación utiliza el scaffold full-stack proporcionado: React, Tailwind, Express, tRPC, Drizzle, autenticación OAuth y almacenamiento de objetos. La base de datos contiene metadatos y relaciones; los bytes multimedia deben residir en almacenamiento de objetos.

## Límites de automatización

Las tareas recurrentes se ejecutarán mediante jobs gestionados por la plataforma y endpoints bajo `/api/scheduled/`. No se utilizarán temporizadores en proceso. Cada job deberá ser idempotente, autenticado, trazable por `taskUid`, limitado en tiempo y capaz de devolver errores JSON diagnosticables. Las respuestas automáticas de correo se crearán inicialmente como borradores, salvo reglas explícitas, auditadas y reversibles.

## Seguridad de IA

El agente debe mantener la personalidad de Belentani Studio, pero no puede inventar hechos, prometer resultados, actuar fuera de sus permisos ni enviar comunicaciones externas sin la política correspondiente. Se validarán las entradas, se limitará el tamaño del contexto, se registrarán metadatos sin contenido sensible y se aplicará fallback seguro cuando el modelo falle.

## Design system verificable

La tipografía usa una jerarquía de display grande para principios y titulares, cuerpo legible para explicación y metadatos en mayúsculas con espaciado amplio. La escala de espaciado se apoya en gutters responsivos y secciones amplias; las tarjetas usan radios moderados y sombras suaves, evitando convertir la plataforma en un panel genérico. La iconografía es lineal y funcional, basada en Lucide. El motion utiliza transiciones cortas de 160–220 ms con `cubic-bezier(0.23, 1, 0.32, 1)` y nunca es necesario para completar una tarea; `prefers-reduced-motion` desactiva el movimiento no esencial.

## Decisiones de arquitectura

Se eligió el scaffold full-stack con React, tRPC, Express y Drizzle porque proporciona contratos tipados, autenticación, almacenamiento y una frontera clara entre UI y servidor. El catálogo se consulta mediante procedimientos tipados y paginación en base de datos. Los procedimientos administrativos usan autorización backend por rol. Los jobs periódicos se modelan con `schedule_cron_task_uid` y callbacks bajo `/api/scheduled/`, sin temporizadores de proceso.

## Supuestos explícitos

Se asume que `belentani.eu` será el dominio principal cuando se publique y que las credenciales de correo externo, si se requiere conexión real con un buzón, se proporcionarán mediante un secreto gestionado, nunca dentro del repositorio. Se asume que el catálogo de más de 3000 entradas se cargará desde fuentes verificables o por el panel de administración; no se inventan herramientas, opiniones, ratings o testimonios. Las tareas que puedan enviar comunicaciones externas quedarán en borrador o revisión humana hasta definir la política de autorización.

## Fronteras de datos

La base de datos conserva metadatos, estado, relaciones, configuración editable y auditoría. El almacenamiento de objetos conserva bytes multimedia. Los secretos permanecen en variables gestionadas. Los prompts y límites del agente viven en `server/agentPolicy.ts`; los datos de marca no sensible viven en `shared/brand.ts`; los contenidos públicos se publican mediante procedimientos de lectura. Nunca se guardan tokens, contraseñas ni el contenido completo de correos en logs.

## Procedimientos operativos

Antes de cambiar el esquema se genera y revisa una migración, y se aplica en orden de dependencia. Antes de activar un job se despliega la versión que contiene su callback y se verifica que el endpoint use `taskUid`, sea idempotente y devuelva errores JSON. Antes de publicar una respuesta automática se valida la plantilla, se registra el actor y se mantiene la capacidad de pausa o rollback. Cada entrega ejecuta typecheck, tests, build, revisión visual y comprobaciones de accesibilidad proporcionales.

## Criterios de aceptación iniciales

La primera entrega debe presentar una landing funcional, navegación clara, catálogo consultable con estados de interfaz, acceso al agente, una estructura de administración protegida, SEO base, accesibilidad de teclado y reducción de movimiento. Las funcionalidades que dependan de credenciales externas quedarán claramente identificadas y no se simularán como activas.

## Decisiones verificadas de la fase de procedencia y operación

La biblioteca multimedia usa elementos nativos `video` y `audio` por su compatibilidad, accesibilidad y soporte del navegador. La optimización implementada consiste en no montar el reproductor hasta que el recurso se aproxime al viewport mediante `IntersectionObserver`, usar `preload="metadata"`, limitar la consulta pública a recursos con estado `published` y mantener el upload protegido por rol. La publicación requiere una operación administrativa explícita mediante `media.review`. El alcance de lectura es **público por diseño** para recursos publicados: `media.list` nunca devuelve borradores ni archivados, y el `publicUrl` solo se expone desde esa consulta filtrada. Los recursos privados o con control por usuario requerirán en una fase posterior un proxy o URL firmada, y no deben reutilizar este contrato público.

El catálogo importado conserva `sourceName`, `sourceUrl`, `license`, `contentHash`, `canonicalUrl`, `ingestedAt`, `reviewStatus` y `quarantineReason`. La idempotencia se basa en la restricción compuesta `(sourceName, canonicalUrl)`. Las URLs candidatas se verifican por HTTPS y respuesta HEAD antes de quedar en revisión o cuarentena. Solo los registros aprobados y publicados se muestran en el catálogo público.

Los controles de automatización ejecutan un preflight desde la interfaz antes de activar un job. La activación se rechaza si el callback permitido o el task UID no están disponibles; la pausa no elimina la configuración. El endpoint periódico solo acepta identidades de cron válidas y omite jobs pausados.

La integración de correo se mantiene en modo de borrador con revisión humana. El servidor puede clasificar y redactar a partir de mensajes autorizados, pero la aplicación no accede directamente a herramientas MCP del usuario ni envía mensajes externos de forma automática. La integración productiva de inbox requiere un conector/API gestionado y sus credenciales, que no se almacenan en el repositorio.

## Automatización implementada: snapshot de catálogo

El callback `POST /api/scheduled/catalog-refresh` autentica exclusivamente identidades cron, resuelve el job por `taskUid` y devuelve `200` para jobs huérfanos o pausados, evitando reintentos inútiles. Para un job activo ejecuta una lectura idempotente de los contadores total, publicado/aprobado, pendiente de revisión y cuarentena; registra el snapshot en logging estructurado, actualiza `lastRunAt` y responde con la evidencia del estado. No modifica contenido ni publica recursos automáticamente. La creación del job productivo requiere desplegar primero el callback, conservar el `scheduleCronTaskUid` en `automation_jobs` y mantener el preflight y la pausa desde administración.
