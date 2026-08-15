# Project TODO

## Identidad, marca y contenido

- [x] Implementar landing page firmada por Pedro Belentani con Belentani Studio como marca principal.
- [x] Incorporar belentani.eu, noiacore.com, @belentani\_ y belentani7studio@proton.me sin inventar datos adicionales.
- [x] Definir sistema visual basado en psicología de la percepción, principios Gestalt, jerarquía visual, contraste y branding estratégico.
- [ ] Definir tokens de color, tipografía, espaciado, radios, sombras, iconografía y motion principles.
- [x] Crear arquitectura pública de contenidos, navegación y llamadas a la acción.

## Catálogo y recursos

- [x] Crear modelo de datos para más de 3000 herramientas y recursos sin datos falsos de reseñas, ratings o testimonios.
- [ ] Implementar catálogo con categorías, etiquetas, búsqueda, filtros, ordenación y paginación eficiente.
- [x] Añadir estados loading, skeleton, empty, error, success y retry al catálogo.
- [ ] Implementar sección multimedia para vídeos y voces con reproductor optimizado, lazy loading y metadatos.
- [ ] Usar almacenamiento de objetos para bytes multimedia y base de datos únicamente para metadatos y autorización.

## Inteligencia artificial

- [x] Implementar agente conversacional de marca Belentani Studio mediante LLM.
- [x] Definir personalidad, tono, límites, instrucciones de sistema y política de respuestas.
- [x] Implementar respuestas contextuales, clasificación de consultas y generación de contenido de marca.
- [x] Implementar fallback seguro cuando el LLM no esté disponible, falle o produzca una salida no válida.
- [ ] Añadir límites de uso, validación de entradas y salidas, registro sin datos sensibles y revisión humana para acciones sensibles.
- [ ] Cubrir el agente con tests de contrato, seguridad, regresión y casos adversariales básicos.

## Automatizaciones y correo

- [ ] Diseñar automatizaciones recurrentes mediante jobs gestionables y observables.
- [ ] Implementar actualización del catálogo de herramientas con idempotencia, validación y cuarentena de cambios dudosos.
- [ ] Implementar informes periódicos de crecimiento y rendimiento.
- [ ] Diseñar respuestas automáticas de correo con plantillas editables desde administración.
- [ ] Implementar clasificación de correo entrante y borradores automáticos.
- [ ] Requerir revisión humana antes de enviar respuestas externas salvo reglas explícitas y reversibles.
- [ ] Implementar notificaciones de nuevos contactos, eventos relevantes y fallos críticos.
- [ ] Añadir historial de ejecuciones, reintentos, timeouts, dead-letter/quarantine y controles de permisos.

## Administración y datos

- [ ] Crear panel privado de administración para herramientas, recursos, automatizaciones, correo y contenido.
- [ ] Implementar control de roles y autorización en backend, no solo ocultación visual.
- [ ] Crear auditoría de acciones administrativas con actor, acción, entidad, timestamp UTC y resultado.
- [x] Aplicar esquema-first para las tablas y migraciones, verificando cada cambio en la base de datos.
- [ ] Mantener separación entre datos públicos, privados, secretos, prompts y configuración.

## SEO, crecimiento y evolución

- [ ] Implementar metadatos dinámicos, títulos, descripciones, Open Graph y Twitter Cards.
- [x] Implementar sitemap.xml, robots.txt, URLs canónicas y datos estructurados Schema.org.
- [ ] Optimizar Core Web Vitals, carga inicial, imágenes, multimedia, fuentes y JavaScript.
- [ ] Implementar analítica con privacidad y eventos de negocio documentados.
- [ ] Crear panel de métricas de rendimiento y crecimiento.
- [x] Crear changelog público de evolución de la plataforma.
- [ ] Registrar mejoras, decisiones, experimentos, resultados y rollback.
- [x] Preparar arquitectura de contenido para posicionamiento global y distribución multicanal sin prácticas engañosas.

## Accesibilidad, seguridad y calidad

- [ ] Cumplir WCAG 2.1 AA en estructura, teclado, foco, contraste, nombres accesibles y formularios.
- [ ] Implementar diseño mobile-first y responsive en los tamaños relevantes.
- [ ] Respetar prefers-reduced-motion y mantener animaciones breves, reversibles y no esenciales.
- [ ] Aplicar validación de entrada/salida, mínimo privilegio, protección CSRF/XSS/SQLi, rate limiting y gestión segura de secretos.
- [x] Añadir logs estructurados sin datos personales sensibles, health checks y métricas operativas.
- [ ] Ejecutar typecheck, lint, build, tests unitarios, pruebas de integración y revisión visual.
- [ ] Verificar estados de error, fallos de red, reintentos, idempotencia y recuperación.
- [x] Documentar arquitectura, decisiones, riesgos, supuestos, límites y procedimientos de operación.

## Brechas detectadas en la revisión

- [ ] Conectar `/catalogo` a `trpc.catalog.list`, eliminar datos hardcodeados, implementar filtros, etiquetas, ordenación y paginación real basada en base de datos.
- [x] Añadir estados completos de catálogo: loading con skeleton, error con retry, empty y success verificable.
- [ ] Construir CRUD real en `/admin` para catálogo, recursos multimedia, plantillas de correo, automatizaciones y contenido.
- [ ] Aplicar autorización backend a todas las consultas y mutaciones administrativas relevantes.
- [ ] Implementar SEO por ruta con metadatos dinámicos y Twitter Cards explícitas.
- [ ] Añadir JSON-LD Schema.org verificable en las páginas públicas.
- [x] Implementar logging estructurado, health check y métricas operativas.
- [ ] Ejecutar y registrar lint y pruebas de integración.

## Brechas técnicas pendientes de verificación

- [ ] Documentar un design system verificable con tokens de tipografía, espaciado, sombras, iconografía y motion principles.
- [ ] Separar prompts, configuración y datos sensibles en módulos dedicados y documentar la frontera entre datos públicos, privados y secretos.
- [ ] Auditar todas las animaciones para asegurar duraciones breves, reversibilidad y carácter no esencial, además de `prefers-reduced-motion`.
- [ ] Implementar métricas operativas reales de latencia, estado de jobs y contadores, y unificar el logging estructurado.
- [x] Ampliar `docs/architecture.md` con decisiones, supuestos y procedimientos operativos.

## Brechas de la revisión más reciente

- [ ] Añadir lazy loading real para multimedia y mejorar el reproductor y su UX.
- [ ] Conectar storage de objetos para multimedia con flujo de subida y lectura autorizado.
- [x] Añadir `quarantineReason` al catálogo y usarlo en la revisión editorial.
- [x] Validar la accesibilidad de cada URL importada antes de guardar o publicar.
- [ ] Implementar ingestión real de inbox autorizado hacia `emailDrafts` sin carga manual.
- [ ] Añadir archivado visible en UI y auditoría completa de cambios de borradores.
- [x] Construir controles funcionales de pausa/activación y preflight de callbacks de automatizaciones.

## Brechas de la revisión más reciente

- [ ] Implementar un reproductor multimedia optimizado o documentar explícitamente el alcance del reproductor nativo.
- [ ] Completar autorización de lectura multimedia y su modelo de acceso, no solo proteger la subida.
- [ ] Conectar `automationPreflight` y `automationSetStatus` a controles visibles del panel.
- [ ] Poblar `ingestedAt` durante la ingesta y mostrarlo en revisión editorial.
- [ ] Añadir una clave única estable por origen y URL canónica para garantizar idempotencia real.

## Brechas confirmadas antes del próximo checkpoint

- [x] Ejecutar `automationPreflight` desde el panel y bloquear activación si no está listo.
- [x] Añadir vista de revisión editorial que muestre `ingestedAt`, `reviewStatus` y `quarantineReason`.
- [x] Cambiar idempotencia a clave estable compuesta por origen y URL canónica con upsert real.

## Brechas confirmadas antes del próximo checkpoint

- [x] Añadir filtro y visualización por etiquetas en el catálogo público y en `trpc.catalog.list`.
- [ ] Implementar un reproductor multimedia más avanzado o documentar explícitamente el alcance del reproductor nativo.
- [ ] Completar un modelo de autorización de lectura multimedia, no solo de subida/publicación.
- [ ] Mostrar explícitamente `reviewStatus` en la cola editorial del catálogo.
- [ ] Añadir readiness/deploy guard verificable antes de activar automatizaciones productivas.

## Brecha de idempotencia pendiente

- [x] Completar el upsert del catálogo importado para actualizar `name`, `description`, `license`, `contentHash`, `ingestedAt`, `reviewStatus` y `quarantineReason` al colisionar por `(sourceName, canonicalUrl)`.

## Entrega

- [ ] Ejecutar validación final reproducible y guardar evidencias.
- [ ] Crear checkpoint solamente cuando la primera entrega esté completa y verificada.
- [ ] Entregar la plataforma en su preview y adjuntar la versión del checkpoint.
- [ ] Documentar secretos o conexiones externas pendientes sin incluir valores sensibles.

## Decisión confirmada: Opción A + borradores con revisión humana

- [x] Seleccionar y documentar fuentes públicas verificables con licencia y condiciones de uso compatibles.
- [x] Añadir a cada entrada de catálogo URL de origen, fuente, fecha de ingesta, licencia, estado y motivo de cuarentena cuando corresponda.
- [x] Implementar pipeline idempotente de ingesta con validación, deduplicación, comprobación de URL y estado pendiente de revisión.
- [x] Evitar publicar entradas importadas hasta aprobación editorial humana.
- [ ] Implementar clasificación de correo entrante y generación de borradores sin envío automático externo.
- [ ] Permitir revisión, edición, aprobación, rechazo y archivado de borradores con auditoría.
- [ ] Mantener pausables las automatizaciones y no activar jobs productivos antes de desplegar y verificar sus callbacks.

## Brechas de implementación analítica

- [x] Crear una vista o sección administrativa conectada a `trpc.metrics.public` para mostrar contadores del embudo.
- [x] Actualizar `docs/analytics.md` con el flujo frontend → `metrics.recordBusinessEvent` → `metrics.public`, consulta y límites.

- [x] Conectar `trackBusinessEvent()` con el procedimiento tRPC backend de eventos agregados.
- [x] Añadir una vista o página administrativa de métricas de negocio.
- [x] Ampliar tests para cubrir los cuatro eventos de superficie y la consulta de métricas.
- [x] Documentar el receptor backend y la consulta de métricas en producción.

- [x] Instrumentar explícitamente `transparency_opened` al cargar `/transparencia` y validarlo con typecheck/tests.
- [x] Persistir o exponer los eventos de analítica de negocio mediante un endpoint/vista verificable.
- [x] Añadir prueba de contrato o evidencia técnica de instrumentación y consulta del embudo completo.

- [x] Instrumentar eventos reales del embudo en `/catalogo`, `/agente`, `/recursos` y `/transparencia`.
- [x] Documentar eventos, propiedades permitidas, métricas derivadas y garantías de privacidad.
- [x] Añadir una vista o endpoint verificable para consultar métricas capturadas o demostrar el proveedor analítico configurado.

## Brechas de implementación estratégica

- [x] Implementar analítica con privacidad para eventos de negocio del embudo y documentar sus métricas.
- [x] Añadir disclosures visibles y campos editoriales para relaciones comerciales por recurso o recomendación.
- [ ] Implementar una automatización real derivada del estudio, con evidencia, límites, pausa y validación.

## Nuevo estudio estratégico: recursos, persistencia, adquisición y monetización

- [x] Auditar coste real de hosting, base de datos, almacenamiento, correo, IA, dominios, analítica y automatizaciones; separar gratis, cuota gratuita y coste variable.
- [x] Verificar persistencia automática, límites de cuotas, caducidad, backups, recuperación y dependencia de proveedores.
- [x] Investigar fuentes públicas y APIs con licencia compatible, trazabilidad y condiciones de reutilización.
- [x] Diseñar estrategia de búsqueda, curación, deduplicación y actualización de recursos sin scraping abusivo ni contenido inventado.
- [x] Diseñar estrategia SEO, contenidos, distribución multicanal y adquisición orgánica medible.
- [x] Evaluar afiliación, patrocinios, anuncios éticos, donaciones, leads B2B, servicios y productos digitales según margen, dependencia y esfuerzo.
- [x] Definir embudo gratuito a monetización sin degradar la misión pública ni ocultar publicidad o afiliación.
- [x] Crear modelo financiero por escenarios sin prometer ingresos garantizados.
- [ ] Convertir las prioridades aprobadas en cambios verificables de producto, analítica y automatización.
