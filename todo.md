# Project TODO

## Identidad, marca y contenido

- [x] Implementar landing page firmada por Pedro Belentani con Belentani Studio como marca principal.
- [x] Incorporar belentani.eu, noiacore.com, @belentani\_ y belentani7studio@proton.me sin inventar datos adicionales.
- [x] Definir sistema visual basado en psicología de la percepción, principios Gestalt, jerarquía visual, contraste y branding estratégico.
- [x] Definir tokens de color, tipografía, espaciado, radios, sombras, iconografía y motion principles.
- [x] Crear arquitectura pública de contenidos, navegación y llamadas a la acción.

## Catálogo y recursos

- [x] Crear modelo de datos para más de 3000 herramientas y recursos sin datos falsos de reseñas, ratings o testimonios.
- [x] Implementar catálogo con categorías, etiquetas, búsqueda, filtros, ordenación y paginación eficiente.
- [x] Añadir estados loading, skeleton, empty, error, success y retry al catálogo.
- [x] Implementar sección multimedia para vídeos y voces con reproductor optimizado, lazy loading y metadatos.
- [x] Usar almacenamiento de objetos para bytes multimedia y base de datos únicamente para metadatos y autorización.

## Inteligencia artificial

- [x] Implementar agente conversacional de marca Belentani Studio mediante LLM.
- [x] Definir personalidad, tono, límites, instrucciones de sistema y política de respuestas.
- [x] Implementar respuestas contextuales, clasificación de consultas y generación de contenido de marca.
- [x] Implementar fallback seguro cuando el LLM no esté disponible, falle o produzca una salida no válida.
- [x] Añadir límites de uso, validación de entradas y salidas, registro sin datos sensibles y revisión humana para acciones sensibles.
- [x] Cubrir el agente con tests de contrato, seguridad, regresión y casos adversariales básicos.

## Automatizaciones y correo

- [x] Diseñar automatizaciones recurrentes mediante jobs gestionables y observables.
- [x] Implementar actualización del catálogo de herramientas con idempotencia, validación y cuarentena de cambios dudosos.
- [x] Implementar informes periódicos de crecimiento y rendimiento.
- [x] Diseñar respuestas automáticas de correo con plantillas editables desde administración.
- [x] Implementar clasificación de correo entrante y borradores automáticos.
- [x] Requerir revisión humana antes de enviar respuestas externas salvo reglas explícitas y reversibles.
- [x] Implementar notificaciones de nuevos contactos, eventos relevantes y fallos críticos.
- [x] Añadir historial de ejecuciones, reintentos, timeouts, dead-letter/quarantine y controles de permisos.

## Administración y datos

- [x] Crear panel privado de administración para herramientas, recursos, automatizaciones, correo y contenido.
- [x] Implementar control de roles y autorización en backend, no solo ocultación visual.
- [x] Crear auditoría de acciones administrativas con actor, acción, entidad, timestamp UTC y resultado.
- [x] Aplicar esquema-first para las tablas y migraciones, verificando cada cambio en la base de datos.
- [x] Mantener separación entre datos públicos, privados, secretos, prompts y configuración.

## SEO, crecimiento y evolución

- [x] Implementar metadatos dinámicos, títulos, descripciones, Open Graph y Twitter Cards.
- [x] Implementar sitemap.xml, robots.txt, URLs canónicas y datos estructurados Schema.org.
- [x] Optimizar Core Web Vitals, carga inicial, imágenes, multimedia, fuentes y JavaScript.
- [x] Implementar analítica con privacidad y eventos de negocio documentados.
- [x] Crear panel de métricas de rendimiento y crecimiento.
- [x] Crear changelog público de evolución de la plataforma.
- [x] Registrar mejoras, decisiones, experimentos, resultados y rollback.
- [x] Preparar arquitectura de contenido para posicionamiento global y distribución multicanal sin prácticas engañosas.

## Accesibilidad, seguridad y calidad

- [ ] Cumplir WCAG 2.1 AA en estructura, teclado, foco, contraste, nombres accesibles y formularios.
- [x] Implementar diseño mobile-first y responsive en los tamaños relevantes.
- [x] Respetar prefers-reduced-motion y mantener animaciones breves, reversibles y no esenciales.
- [x] Aplicar validación de entrada/salida, mínimo privilegio, protección CSRF/XSS/SQLi, rate limiting y gestión segura de secretos.
- [x] Añadir logs estructurados sin datos personales sensibles, health checks y métricas operativas.
- [x] Ejecutar typecheck, lint, build, tests unitarios, pruebas de integración y revisión visual.
- [ ] Completar la verificación de estados de error, fallos de red, reintentos, idempotencia y recuperación con evidencia end-to-end; la cobertura local está documentada en la auditoría de resiliencia.
- [x] Documentar arquitectura, decisiones, riesgos, supuestos, límites y procedimientos de operación.

## Brechas detectadas en la revisión

- [x] Conectar `/catalogo` a `trpc.catalog.list`, eliminar datos hardcodeados, implementar filtros, etiquetas, ordenación y paginación real basada en base de datos.
- [x] Añadir estados completos de catálogo: loading con skeleton, error con retry, empty y success verificable.
- [x] Construir CRUD administrativo en `/admin` para catálogo, recursos multimedia, plantillas de correo, automatizaciones y contenido, usando archivado lógico donde corresponde.
- [x] Aplicar autorización backend a todas las consultas y mutaciones administrativas relevantes.
- [x] Implementar SEO por ruta con metadatos dinámicos y Twitter Cards explícitas.
- [x] Añadir JSON-LD Schema.org verificable en las páginas públicas.
- [x] Implementar logging estructurado, health check y métricas operativas.
- [x] Ejecutar y registrar lint y pruebas de integración.

## Brechas de design system pendientes

- [x] Leer directamente cada archivo detectado por el inventario de motion y registrar cada coincidencia exacta.
- [x] Añadir a la matriz la clase exacta, duración verificable, reversibilidad, esencialidad y comportamiento reduced-motion por coincidencia.
- [x] Corregir o justificar cada elemento cuya duración o degradación no esté demostrada.

## Brechas de design system pendientes

- [x] Crear matriz de auditoría de motion por archivo/componente detectado con tipo, duración, reversibilidad, función, reducción de movimiento y estado.
- [x] Revisar individualmente cada coincidencia `animate-*`, `transition-*`, overlay, spinner y skeleton, documentando evidencia.
- [x] Corregir o justificar formalmente cualquier animación sin duración verificable menor de 300 ms o sin degradación segura.

- [x] Auditar exhaustivamente todas las animaciones y transiciones en páginas y componentes UI reutilizables.
- [x] Registrar inventario por archivo/componente y estado de cumplimiento en la documentación.

- [x] Documentar tokens verificables de tipografía, sombras e iconografía en `client/src/index.css`.
- [x] Ampliar `docs/design-system.md` con tablas de tokens vinculadas a archivos reales.
- [x] Auditar las animaciones de las superficies principales y documentar duración, reversibilidad y reducción de movimiento.

## Brechas técnicas pendientes de verificación

- [x] Documentar un design system verificable con tokens de tipografía, espaciado, sombras, iconografía y motion principles.
- [x] Separar prompts, configuración y datos sensibles en módulos dedicados y documentar la frontera entre datos públicos, privados y secretos.
- [x] Auditar todas las animaciones para asegurar duraciones breves, reversibilidad y carácter no esencial, además de `prefers-reduced-motion`.
- [x] Implementar métricas operativas reales de latencia, estado de jobs y contadores, y unificar el logging estructurado.
- [x] Ampliar `docs/architecture.md` con decisiones, supuestos y procedimientos operativos.

## Brechas de la revisión más reciente

- [x] Añadir lazy loading real para multimedia y mejorar el reproductor y su UX.
- [x] Conectar storage de objetos para multimedia con flujo de subida y lectura autorizado.
- [x] Añadir `quarantineReason` al catálogo y usarlo en la revisión editorial.
- [x] Validar la accesibilidad de cada URL importada antes de guardar o publicar.
- [ ] Implementar ingestión real de inbox autorizado hacia `emailDrafts` sin carga manual.
- [x] Añadir archivado visible en UI y auditoría completa de cambios de borradores.
- [x] Construir controles funcionales de pausa/activación y preflight de callbacks de automatizaciones.

## Brechas de la revisión más reciente

- [x] Implementar un reproductor multimedia optimizado o documentar explícitamente el alcance del reproductor nativo.
- [x] Completar autorización de lectura multimedia y su modelo de acceso, no solo proteger la subida.
- [x] Conectar `automationPreflight` y `automationSetStatus` a controles visibles del panel.
- [x] Poblar `ingestedAt` durante la ingesta y mostrarlo en revisión editorial.
- [x] Añadir una clave única estable por origen y URL canónica para garantizar idempotencia real.

## Brechas confirmadas antes del próximo checkpoint

- [x] Ejecutar `automationPreflight` desde el panel y bloquear activación si no está listo.
- [x] Añadir vista de revisión editorial que muestre `ingestedAt`, `reviewStatus` y `quarantineReason`.
- [x] Cambiar idempotencia a clave estable compuesta por origen y URL canónica con upsert real.

## Brechas confirmadas antes del próximo checkpoint

- [x] Añadir filtro y visualización por etiquetas en el catálogo público y en `trpc.catalog.list`.
- [x] Implementar un reproductor multimedia más avanzado o documentar explícitamente el alcance del reproductor nativo.
- [x] Completar un modelo de autorización de lectura multimedia, no solo de subida/publicación.
- [x] Mostrar explícitamente `reviewStatus` en la cola editorial del catálogo.
- [x] Añadir readiness/deploy guard verificable antes de activar automatizaciones productivas.

## Brecha de idempotencia pendiente

- [x] Completar el upsert del catálogo importado para actualizar `name`, `description`, `license`, `contentHash`, `ingestedAt`, `reviewStatus` y `quarantineReason` al colisionar por `(sourceName, canonicalUrl)`.

## Entrega

- [x] Ejecutar validación final reproducible y guardar evidencias.
- [ ] Crear checkpoint solamente cuando la primera entrega esté completa y verificada.
- [ ] Entregar la plataforma en su preview y adjuntar la versión del checkpoint.
- [x] Documentar secretos o conexiones externas pendientes sin incluir valores sensibles.

## Decisión confirmada: Opción A + borradores con revisión humana

- [x] Seleccionar y documentar fuentes públicas verificables con licencia y condiciones de uso compatibles.
- [x] Añadir a cada entrada de catálogo URL de origen, fuente, fecha de ingesta, licencia, estado y motivo de cuarentena cuando corresponda.
- [x] Implementar pipeline idempotente de ingesta con validación, deduplicación, comprobación de URL y estado pendiente de revisión.
- [x] Evitar publicar entradas importadas hasta aprobación editorial humana.
- [x] Implementar clasificación de correo entrante y generación de borradores sin envío automático externo.
- [x] Permitir revisión, edición, aprobación, rechazo y archivado de borradores con auditoría.
- [x] Mantener pausables las automatizaciones y no activar jobs productivos antes de desplegar y verificar sus callbacks.

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
- [x] Implementar una automatización real derivada del estudio, con evidencia, límites, pausa y validación.

## Nuevo estudio estratégico: recursos, persistencia, adquisición y monetización

- [x] Auditar coste real de hosting, base de datos, almacenamiento, correo, IA, dominios, analítica y automatizaciones; separar gratis, cuota gratuita y coste variable.
- [x] Verificar persistencia automática, límites de cuotas, caducidad, backups, recuperación y dependencia de proveedores.
- [x] Investigar fuentes públicas y APIs con licencia compatible, trazabilidad y condiciones de reutilización.
- [x] Diseñar estrategia de búsqueda, curación, deduplicación y actualización de recursos sin scraping abusivo ni contenido inventado.
- [x] Diseñar estrategia SEO, contenidos, distribución multicanal y adquisición orgánica medible.
- [x] Evaluar afiliación, patrocinios, anuncios éticos, donaciones, leads B2B, servicios y productos digitales según margen, dependencia y esfuerzo.
- [x] Definir embudo gratuito a monetización sin degradar la misión pública ni ocultar publicidad o afiliación.
- [x] Crear modelo financiero por escenarios sin prometer ingresos garantizados.
- [x] Convertir las prioridades aprobadas en cambios verificables de producto, analítica y automatización.

## Rediseño visual NOIACORE LAB — solo identidad

- [x] Mantener literalmente todos los textos, la fuente actual del título, la estructura, el orden de bloques y las funcionalidades.
- [x] Sustituir únicamente la paleta por negro absoluto, grafito, gris piedra y blancos espectrales, sin tonos cálidos ni saturados.
- [x] Aplicar atmósfera oscura, silenciosa, tecnológica y monumental mediante fondos, bordes, superficies y geometría sutil.
- [x] Mantener botones, formularios, enlaces y flujos existentes, ajustando solo su tratamiento cromático y visual.
- [x] Verificar que no se modificaron textos ni arquitectura de información mediante typecheck, pruebas y revisión visual.

## Verificación visual integral NOIACORE pendiente

- [x] Revisar visualmente todas las rutas públicas, administrativas, 404 y diálogos relevantes para confirmar la atmósfera fría y oscura.
- [x] Añadir geometría sutil y consistente únicamente donde ya existan superficies visuales, sin alterar contenido ni estructura.
- [x] Verificar mediante diff dirigido que textos, rutas, orden de bloques y flujos no cambiaron durante el rediseño.

## Verificación visual final antes del checkpoint

- [x] Abrir y revisar visualmente un diálogo real de autenticación con la nueva paleta fría.
- [x] Añadir una geometría sutil explícita y reutilizable en superficies existentes, sin añadir contenido ni cambiar estructura.
- [x] Ampliar el diff de integridad a todos los archivos visuales modificados y separar los cambios técnicos previos de SEO/carga diferida.

## Trazabilidad final del rediseño

- [x] Guardar un diff verificable de todos los archivos visuales tocados, demostrando cambios limitados a estilos, tokens y colores.
- [x] Documentar separadamente los cambios técnicos previos de `App.tsx`, SEO server-side y carga diferida.

## Validación y métricas pendientes

- [x] Ampliar el panel administrativo para combinar crecimiento y rendimiento: embudo, requests, latencia media del agente, fallbacks y estado de jobs.
- [x] Añadir pruebas de integración reproducibles para flujos tRPC/API reales y ejecutarlas en la validación final.
- [x] Registrar en documentación la evidencia separada de lint, typecheck, unitarias, integración, build y revisión visual.

## Integración tRPC pendiente

- [x] Añadir una prueba HTTP reproducible que invoque un procedimiento real sobre `/api/trpc` y documentar su cobertura end-to-end.

## Seguridad avanzada del agente pendiente

- [x] Aplicar una política server-side que fuerce revisión humana para categorías o acciones sensibles antes de responder.
- [x] Ampliar pruebas del agente con respuesta estructurada válida, fallback ante error o salida inválida y garantía de no registrar contenido sensible.

## Fronteras de datos con módulos dedicados

- [x] Crear un módulo de acceso privado para drafts/usuarios y conectar el router administrativo a sus funciones.
- [x] Ampliar `docs/data-boundaries.md` con el mapeo verificable de módulo, tipo de dato y nivel de acceso.

## Auditoría responsive integral pendiente

- [x] Verificar responsive en todas las rutas y estados relevantes, incluyendo transparencia, changelog, 404, diálogos y estados de catálogo.
- [x] Revisar breakpoints, desbordes y adaptación de navegación, filtros, cards, formularios y métricas administrativas; corregir hallazgos.

## Rendimiento verificable pendiente

- [x] Reducir el chunk `framework` restante por debajo del umbral advertido mediante separación adicional segura.
- [x] Auditar y documentar optimizaciones de imágenes, multimedia y fuentes, justificando los casos no aplicables.
- [x] Añadir evidencia reproducible de rendimiento/CWV y carga inicial antes de cerrar la optimización.

## Auditoría persistente de drafts pendiente

- [x] Crear historial persistente de cambios de drafts con actor, acción, estado previo/nuevo, timestamp UTC y cambios de contenido.
- [x] Mostrar el historial de auditoría de drafts en el panel administrativo junto al archivado visible.

## Observabilidad y automatización estratégica pendientes

- [x] Crear un módulo compartido de logging estructurado y conectarlo explícitamente a router, callbacks y servicios críticos.
- [x] Documentar la cobertura de métricas, latencia y estados de jobs con sus puntos de instrumentación.
- [x] Implementar una automatización estratégica completa y verificable, como informe periódico de crecimiento o sync real de catálogo, con ejecución end-to-end observable, pausa, límites y pruebas.

## Growth report end-to-end pendiente

- [x] Conectar un job de automatización real al callback `/api/scheduled/growth-report`, con callbackPath configurable y guard de activación.
- [x] Añadir pruebas de integración o contrato para el callback growth report y documentar snapshot, límites y operación periódica end-to-end.
- [x] Actualizar el panel administrativo para distinguir y operar el informe de crecimiento frente al snapshot de catálogo.

## Administración completa y auditoría transversal pendiente

- [x] Completar gestión verificable de recursos multimedia y contenido editorial dentro de `/admin`, sin dejar acciones visuales sin backend.
- [x] Extender `admin_action_audit` a revisión editorial, ingesta, media upload/publicación y contenido editorial.
- [x] Añadir una vista administrativa de auditoría transversal y pruebas de contrato que verifiquen actor, acción, entidad, occurredAt y outcome.

## Trazabilidad estratégica pendiente

- [x] Documentar el mapeo prioridad→cambio→archivo/evidencia para producto, analítica y automatización.
- [x] Justificar formalmente las prioridades estratégicas restantes que no se han convertido en cambios de producto verificables.

## Brechas de evidencia de la auditoría final

- [ ] Ejecutar una auditoría WCAG verificable por ruta con checklist de teclado, foco visible, nombres accesibles, contraste medido y resultados por formulario/estado crítico.
- [ ] Corregir cualquier hallazgo WCAG real y adjuntar evidencia verificable antes de declarar conformidad AA completa.
- [x] Completar el hardening con validación de salida donde aplique, estrategia CSRF más robusta para mutaciones autenticadas y requisito externo explícito para rate limiting distribuido en producción.
- [x] Añadir una matriz verificable que mapee input/output, privilegios, CSRF, XSS, SQLi, rate limiting y secretos a implementación y prueba concreta.

## Brechas de resiliencia end-to-end

- [x] Añadir pruebas deterministas explícitas de timeout y recuperación para catálogo y callbacks programados, además de las pruebas locales ya existentes de LLM y automatizaciones.
- [x] Documentar por flujo UI pública, agente, multimedia y automatizaciones qué estados de error, retry y recovery existen y qué casos dependen del proveedor o navegador.
- [ ] No declarar completa la verificación de resiliencia hasta cubrir con tests o evidencia reproducible los casos críticos end-to-end.

## Notificaciones de finalización en interfaz

- [x] Añadir preferencias opt-in para notificaciones de escritorio y sonido, con persistencia local y controles accesibles.
- [x] Solicitar permiso de Notification únicamente tras una interacción explícita del usuario.
- [x] Emitir notificación y sonido al completar operaciones relevantes sin interrumpir la interfaz ni duplicar eventos.
- [x] Respetar `prefers-reduced-motion`, bloqueo/autoplay del navegador y fallback silencioso seguro.
- [x] Añadir pruebas unitarias y validación de build para el sistema de notificaciones.

## Precisión del ciclo de reintentos de automatizaciones

- [x] Registrar y actualizar el número real de intento por ejecución cuando el proveedor lo comunique; no asumir que `attempt=1` representa todos los reintentos.
- [x] Implementar y documentar un flujo verificable de dead-letter al agotar reintentos o al detectar fallos terminales de callbacks.
- [x] Añadir pruebas reproducibles de automatizaciones que cubran fallo, retry esperado, timeout documentado y transición a cuarentena/dead-letter.
- [x] Separar explícitamente en la documentación los metadatos persistidos por la aplicación de los reintentos y timeout que dependen del scheduler externo.

## Ingestión Gmail autorizada

- [x] Verificar las herramientas y permisos efectivos del conector Gmail sin enviar ni modificar mensajes.
- [x] Definir un contrato de ingestión de solo lectura con límite de mensajes, extracción segura y deduplicación por messageId/threadId.
- [x] Implementar creación idempotente de emailDrafts desde mensajes autorizados, conservando revisión humana y sin envío automático.
- [x] Registrar auditoría sin guardar más contenido sensible del necesario y documentar el alcance de Gmail.
- [x] Añadir tests de privacidad, deduplicación, errores del proveedor y regresión del panel de borradores.

## Guía visual maestra NOIACORE LAB

- [x] Crear un prompt maestro reutilizable con vocabulario descriptivo y variantes semánticas del universo NOIACORE LAB.
- [x] Consolidar tokens explícitos de negro absoluto, superficies azul profundo, blancos espectrales, bordes, gradientes y cristal oscuro.
- [x] Aplicar los tokens y efectos a la interfaz existente sin cambiar textos, estructura, rutas, contenido ni funcionalidades.
- [x] Mantener las animaciones dentro de la política efectiva de motion y respetar `prefers-reduced-motion`, aunque la guía visual proponga transiciones lentas.
- [x] Verificar mediante diff, typecheck, tests, lint y build que el rediseño no altera la semántica ni los flujos existentes.

## Distinción entre evento y nuevo contacto

- [x] Implementar una notificación deduplicada para la llegada de un contacto real mediante formulario, email draft ingerido o lead persistido, no solo mediante clic de contacto.
- [x] Añadir pruebas y documentación que distingan fallos críticos, eventos relevantes y nuevos contactos reales.

## Inbox Gmail dentro del producto

- [ ] Implementar la lectura real del inbox autorizado desde el producto o backend, no solo aceptar mensajes ya leídos externamente, y conectar ese flujo a `emailDrafts` sin carga manual.
- [x] Añadir una prueba verificable del flujo inbox→clasificación→draft dentro del sistema, incluyendo caso vacío y error del proveedor.

## Arquitectura de lectura automática Gmail

- [x] Elegir entre una ejecución periódica autorizada de baja frecuencia y un proceso web persistente, documentando coste, latencia, seguridad y mantenimiento.
- [x] No activar ningún job ni crear una conexión automática hasta que la arquitectura sea aprobada y el endpoint esté desplegado/verificado.

## Variante negro y gris piedra con atmósfera lenta

- [x] Sustituir los acentos azules visibles sobre fondos oscuros por una escala de negro, grafito y gris piedra de bajo impacto cromático.
- [x] Ajustar superficies, bordes y luces para conservar legibilidad sin reflejos azules intensos ni halos agresivos.
- [x] Añadir una atmósfera de fondo de movimiento lento, discreto y no distractor, sin desplazar contenido ni afectar la interacción.
- [x] Aplicar fallback estático y `prefers-reduced-motion` para evitar movimiento a usuarios que lo soliciten.
- [x] Validar contraste, typecheck, lint, tests, build y revisión visual antes del checkpoint.

## Enriquecimiento autorizado de NOIACORE LAB

- [x] Recibir o localizar únicamente los currículums, proyectos, emails y fotos que el usuario autorice de forma concreta; se recibió una respuesta textual y no se recibieron fotografías ni exportaciones.
- [x] Crear un inventario privado de materiales con origen, permiso de uso, sensibilidad y decisión de publicación.
- [x] Investigar fuentes fiables sobre frontend, bases de datos, Gestalt, teoría de la mente, metacognición, armonía perceptiva y escaparatismo.
- [x] Convertir la investigación en principios de narrativa, arquitectura de información, jerarquía visual y recorridos de usuario.
- [x] Aplicar mejoras a la web sin inventar biografía, logros, proyectos, testimonios, reseñas ni datos personales.
- [x] Validar privacidad, accesibilidad, rendimiento, SEO, motion y regresiones antes de un checkpoint.

## Inventario de repositorios GitHub para enriquecimiento

- [x] Definir categorías prioritarias y criterios de selección: actividad, licencia, documentación, seguridad, compatibilidad y mantenimiento.
- [x] Buscar repositorios públicos relevantes para frontend, bases de datos, accesibilidad, percepción, visualización y automatización.
- [x] Guardar URLs, licencia, señales de salud, encaje técnico y riesgos de cada candidato.
- [x] Seleccionar integraciones que no alteren textos, privacidad, contratos ni mantenimiento sin aprobación; se decidió no incorporar código externo en esta iteración.
- [x] Aplicar únicamente mejoras compatibles y validar la suite completa antes del checkpoint; el producto conserva el stack existente y la suite pasa completa.

- [x] Inventario GitHub ampliado a más de 80 repositorios únicos con criterios de licencia y mantenimiento

- [x] Eliminar el token azul residual de NotFound y actualizar la auditoría WCAG para reflejar la paleta negro/gris piedra/blanco espectral.
- [x] Ejecutar una comprobación estática final de paleta, motion, secretos, build y pruebas tras la corrección visual.

- [x] Completar mutaciones CRUD administrativas no destructivas para catálogo, multimedia, plantillas y changelog, con auditoría y pruebas de autorización.

- [x] Implementar CRUD administrativo de automatizaciones: alta, edición, baja lógica/archivo, validación de callbacks, permisos y auditoría.
- [x] Añadir pruebas de contrato para las operaciones CRUD de automatizaciones y revisar el lenguaje del backlog para distinguir archivado lógico de eliminación física.

- [x] Incorporar el nombre profesional autorizado Pedro Belentani y la biografía proporcionada sin añadir afirmaciones externas.
- [x] Añadir estudios, idiomas y especialidades declarados por el usuario con separación clara entre hechos y posicionamiento narrativo.
- [x] Añadir los cuatro proyectos autorizados y mantener anonimizada la actividad vinculada a Meta e Inditex según las instrucciones recibidas.
- [x] Mantener prohibidos ingresos, métricas confidenciales, testimonios no verificables y títulos no declarados; validar copy y SEO tras el enriquecimiento.
- [x] Documentar el inventario de materiales autorizados y la ausencia de fotografías proporcionadas.
- [x] Corregir la repetición del rol profesional en la presentación pública del perfil autorizado sin alterar los hechos declarados.

- [ ] Revisar estado final, pendientes reales y secretos antes de publicar el repositorio.
- [ ] Estudiar una referencia frontend pública y documentar qué patrones son compatibles con NOIACORE LAB.
- [ ] Localizar o crear un repositorio GitHub privado vacío para NOIACORE LAB y publicar el código validado.
- [ ] Verificar el repositorio publicado, su visibilidad, historial y enlace final.
