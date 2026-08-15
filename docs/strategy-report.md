# Belentani Studio — Estrategia de recursos, persistencia, crecimiento y monetización

> **Aviso financiero:** soy una IA, no un asesor financiero autorizado. Este documento es análisis estratégico, no una garantía de rentabilidad; los ingresos, costes y resultados pueden variar y el riesgo operativo y económico corresponde al titular del proyecto.

## Resumen ejecutivo

La promesa de “coste cero absoluto, persistencia total e ingresos pasivos máximos” no es técnicamente ni comercialmente garantizable. La estrategia más sólida es optimizar para **coste mínimo controlado**, no para coste cero: servir la mayor parte del contenido como estático, reservar el cómputo dinámico para acciones autenticadas, almacenar multimedia fuera de la base de datos, limitar el uso de IA, mantener exportaciones reproducibles y establecer límites que impidan facturación accidental.

La plataforma actual de Belentani Studio ya tiene una base útil para este enfoque: catálogo trazable, revisión editorial, agente con fallback, administración, changelog, métricas y automatizaciones pausables. La siguiente ventaja no es añadir miles de páginas genéricas, sino construir un índice curado con fuentes, etiquetas, comparativas propias, casos de uso y contexto en español, catalán e inglés. Google advierte que generar muchas páginas poco originales mediante IA, scraping o combinaciones sin valor puede considerarse abuso de contenido escalado [1].

La monetización debe empezar por **captación B2B y afiliación contextual transparente**, seguida de patrocinios y donaciones. Los anuncios deben esperar a que exista tráfico cualificado y aprobación del proveedor. Las membresías, una API pública limitada y productos digitales pueden aportar ingresos, pero dejan de ser puramente pasivos porque requieren soporte, actualización, control de abuso y cumplimiento.

## 1. Arquitectura de coste mínimo realista

La arquitectura recomendada es conservar el backend gestionado actual para evitar una migración prematura y diseñar una frontera portable. La base de datos debe contener metadatos, estados y auditoría; los bytes multimedia deben almacenarse en object storage; el frontend público debe cachearse; y las tareas periódicas deben ejecutarse mediante callbacks autenticados y pausables, nunca con temporizadores persistentes dentro del proceso web.

| Componente        | Estrategia recomendada                                                                                    | Realidad económica y operativa                                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend público  | Renderizar páginas públicas ligeras, cacheables y con assets optimizados                                  | El coste puede ser muy bajo, pero el dominio, analítica, imágenes y servicios externos no son necesariamente gratuitos.                                                          |
| Backend           | Mantener el servidor actual y reservar tRPC para operaciones dinámicas y administrativas                  | Cada llamada LLM, webhook, consulta intensiva o almacenamiento puede tener límites o coste variable.                                                                             |
| Base de datos     | Mantener una sola base relacional con índices para catálogo y estados                                     | Los planes gratuitos pueden pausar proyectos, limitar tamaño, egress o backups. Supabase Free declara pausa tras una semana de inactividad y no incluye backups automáticos [3]. |
| Multimedia        | Object storage, límites de tamaño, MIME allowlist, cuarentena y URLs con acceso controlado                | Cloudflare R2 ofrece un tramo gratuito, pero cobra almacenamiento y operaciones al superar los límites; egress gratuito no significa coste total cero [2].                       |
| IA                | Usar LLM solo para clasificación, borradores y tareas de alto valor; cachear respuestas y aplicar límites | Las cuotas gratuitas cambian, pueden requerir créditos o limitar velocidad; no se debe depender de una única API.                                                                |
| Jobs              | Jobs pequeños, idempotentes, con ventana de ejecución, retry y pausa                                      | El plan gratuito de Workers tiene 100.000 solicitudes diarias y 10 ms de CPU por invocación; el plan pago parte de 5 USD/mes [1a].                                               |
| Hosting comercial | No basar un negocio monetizado en Vercel Hobby                                                            | Vercel indica que Hobby es para uso personal y no comercial [4].                                                                                                                 |
| Backups           | Exportación periódica cifrada y prueba de restauración en una cuenta o proveedor separado                 | “Persistencia” sin backup restaurable no es recuperación; debe existir un procedimiento probado.                                                                                 |

La regla financiera es **budget guard**: ningún proveedor debe poder generar un cargo ilimitado. Hay que configurar cuotas, alertas, límites de CPU, tamaño máximo de archivos, máximo de páginas a ingerir, máximo de llamadas LLM y pausa automática ante error o desviación.

## 2. Estrategia de búsqueda y curación de recursos

La plataforma no debe intentar copiar internet. Debe construir un **grafo curado de recursos** con cuatro capas. La primera contiene fuentes permitidas y licencia. La segunda contiene candidatos importados con URL canónica, fuente, hash, fecha, licencia y estado pendiente. La tercera añade verificación técnica, categoría, etiquetas y relación con casos de uso. La cuarta publica únicamente entradas revisadas, con una nota editorial propia y fecha de última comprobación.

La búsqueda debe combinar listas open source, directorios oficiales, documentación de proyectos, registros públicos y fuentes aportadas por el titular. Cada fuente requiere una ficha con dominio, licencia, permiso de redistribución, frecuencia de actualización, límites de robots/API, idioma y riesgo. No se deben copiar descripciones extensas protegidas por copyright; se deben guardar metadatos mínimos, enlaces, atribución y una descripción original de utilidad.

| Fase           | Automatización                                                                              | Control humano                                         |
| -------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Descubrimiento | Leer solo allowlists y formatos permitidos; limitar tamaño, frecuencia y dominios           | Aprobar nuevas fuentes y revisar la licencia.          |
| Normalización  | Canonicalizar URL, deduplicar por fuente+URL, normalizar etiquetas y detectar enlaces rotos | Resolver conflictos y falsos positivos.                |
| Evaluación     | HEAD/GET controlado, MIME allowlist, detección de redirecciones y cuarentena                | Revisar seguridad, utilidad y coherencia de categoría. |
| Publicación    | Insertar como `pending_review`; nunca publicar automáticamente                              | Aprobar, editar, rechazar o archivar.                  |
| Actualización  | Recalcular hash, comparar cambios y generar una propuesta                                   | Aceptar cambios sustanciales y mantener historial.     |

El objetivo de 3.000 recursos debe medirse como **3.000 entradas publicables y verificadas**, no como 3.000 filas importadas. Si no existe una fuente legal y de calidad suficiente, se debe solicitar un CSV/JSON autorizado o reducir el objetivo temporalmente.

## 3. SEO y adquisición orgánica

El crecimiento orgánico debe apoyarse en páginas con intención clara: “herramientas para [caso de uso]”, comparativas con metodología propia, guías de alfabetización digital, glosarios, recursos locales y páginas de autoría firmadas por Pedro Belentani. Cada página debe aportar selección, criterio, contexto, fecha, fuentes y enlaces internos relevantes. La IA puede ayudar a clasificar o redactar borradores, pero no debe producir una red de páginas indistinguibles.

La arquitectura SEO mínima es: URLs canónicas, sitemap dinámico, robots coherente, JSON-LD correcto, metadatos por ruta, páginas de categoría útiles, Open Graph, páginas rápidas y revisión de enlaces. La prioridad debe ser **calidad y cobertura temática**, no publicar volumen artificial. Google define como abuso la creación masiva de contenido sin valor, incluido el producido con IA o scraping [5].

| Canal            | Activo inicial                                                                   | Métrica principal                                                       | Criterio de continuidad                                     |
| ---------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------- |
| SEO              | Guías y categorías con fuentes y ejemplos propios                                | Impresiones no branded, CTR y páginas que generan sesiones cualificadas | Mantener solo clusters con crecimiento y utilidad.          |
| Newsletter       | Resumen editorial semanal con recursos aprobados                                 | Suscripción confirmada, apertura y clic cualificado                     | Pausar si aumenta queja o baja la calidad.                  |
| Social           | Fragmentos de criterio, casos y vídeos breves                                    | Guardados, clics y menciones cualificadas                               | Reutilizar solo piezas con señal de interés.                |
| Partnerships     | Enlaces de universidades, comunidades, proyectos open source y entidades cívicas | Referidos y menciones verificables                                      | No comprar enlaces ni intercambiar enlaces artificialmente. |
| Búsqueda directa | Marca Belentani Studio, Pedro Belentani y proyectos relacionados                 | Consultas de marca y navegaciones directas                              | Consolidar identidad y perfiles coherentes.                 |

## 4. Monetización priorizada

La monetización no debe degradar el acceso gratuito. La secuencia recomendada es: primero medir demanda; luego activar enlaces de afiliación solo donde exista recomendación editorial real; después captar solicitudes B2B; finalmente evaluar anuncios, donaciones y productos. En la Unión Europea la publicidad, los patrocinios y la afiliación deben divulgarse de forma clara [6].

| Modelo                |           Potencial | Mantenimiento |                                                        Riesgo | Decisión                                                                                      |
| --------------------- | ------------------: | ------------: | ------------------------------------------------------------: | --------------------------------------------------------------------------------------------- |
| Afiliación contextual |               Medio |    Bajo-medio | Dependencia de programas, transparencia y cambios de comisión | Prioridad 1, con `rel="sponsored"`, disclosure visible y control editorial.                   |
| Leads B2B             | Alto por conversión |         Medio |          Privacidad, cualificación y expectativas del cliente | Prioridad 1; es semipasivo, no pasivo.                                                        |
| Donaciones            |          Bajo-medio |          Bajo |               Dependencia de confianza y volumen de audiencia | Prioridad 2; GitHub Sponsors y Buy Me a Coffee pueden servir, verificando comisiones [7] [8]. |
| Patrocinios           |          Medio-alto |         Medio |                           Conflicto editorial y transparencia | Prioridad 2; separar patrocinio de ranking editorial.                                         |
| Publicidad ética      |      Bajo al inicio |    Bajo-medio |          Aprobación, umbrales y poco ingreso con poco tráfico | Prioridad 3; EthicalAds indica aprobación y mínimo de pago de 50 USD [9].                     |
| API de datos          |          Medio-alto |          Alto |                            Seguridad, abuso, uptime y soporte | Prioridad 3, solo después de estabilizar catálogo y límites.                                  |
| Membresía             |               Medio |          Alto |             Soporte y obligación de entregar valor recurrente | No vender como pasivo; probar con lista de espera.                                            |
| Productos digitales   |          Medio-alto |         Medio |                           Actualización, reembolsos y soporte | Prioridad 2 si se basan en metodología propia.                                                |

La página de cada recomendación monetizada debe incluir: relación comercial, fecha de comprobación, metodología, alternativas gratuitas, criterios de selección y enlace de privacidad. La IA no debe insertar enlaces afiliados en textos sin revisión editorial ni ocultar que existe comisión.

## 5. Embudo gratuito sin degradar la misión pública

El catálogo y los contenidos gratuitos son el nivel de descubrimiento. El visitante puede guardar recursos, consultar guías y usar el agente con límites razonables. El siguiente nivel ofrece alertas, colecciones exportables, diagnósticos de presencia digital o plantillas mejoradas. El nivel B2B ofrece auditoría, arquitectura, automatización y acompañamiento, pero debe quedar explícito que se trata de servicio profesional.

El activo principal no es un anuncio: es una **base propia de intención consentida**, formada por suscripciones confirmadas, preferencias de temas, historial agregado y solicitudes explícitas. No se deben vender datos personales ni añadir personas a campañas sin consentimiento. Las comunicaciones automáticas deben generar borradores hasta contar con una política y proveedor plenamente configurados.

## 6. Escenarios financieros sin promesa

| Escenario  | Tráfico cualificado | Monetización                                   | Resultado esperado                                                                   |
| ---------- | ------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------ |
| Validación | Bajo                | Sin anuncios; afiliación limitada y donaciones | Aprendizaje, primeras conversiones y coste controlado.                               |
| Tracción   | Medio               | Afiliación, leads y patrocinios pequeños       | Ingreso variable; requiere mejor contenido y seguimiento.                            |
| Escala     | Alto                | Leads B2B, productos y API limitada            | Puede superar el coste operativo, pero exige soporte, seguridad y proveedor de pago. |

No se debe presupuestar infraestructura con ingresos hipotéticos. Primero se fija un presupuesto máximo mensual, después se instrumenta el coste por sesión, coste por consulta LLM, coste por recurso multimedia y valor por lead. La decisión de activar una fuente de ingresos debe depender de datos observados, no de un cálculo de “ingreso pasivo máximo”.

## 7. Prioridades de implementación

Durante la siguiente iteración, la plataforma debe añadir disclosures de afiliación, entidades de monetización, eventos de conversión sin datos sensibles, límites de uso, un tablero de coste y un modo de importación de fuentes que conserve licencia y atribución. También debe completar el webhook de inbox únicamente cuando exista un secreto gestionado y un proveedor de correo autorizado; no se debe simular esa integración.

La arquitectura actual puede evolucionar sin migración inmediata: primero se reduce el coste mediante cache, consultas paginadas, almacenamiento de objetos y límites; después se añade un adaptador de proveedor si el volumen justifica cambiar. El criterio de éxito es que cada automatización tenga pausa, rollback, auditoría y coste máximo previsto.

## Referencias

[1]: https://developers.google.com/search/docs/essentials/spam-policies "Google Search Spam Policies"
[1a]: https://developers.cloudflare.com/workers/platform/pricing/ "Cloudflare Workers Pricing"
[2]: https://developers.cloudflare.com/r2/pricing/ "Cloudflare R2 Pricing"
[3]: https://supabase.com/pricing "Supabase Pricing"
[4]: https://vercel.com/docs/plans/hobby "Vercel Hobby Plan"
[5]: https://developers.google.com/search/docs/essentials/spam-policies "Google Search Spam Policies"
[6]: https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/influencer-legal-hub_en "European Commission Influencer Legal Hub"
[7]: https://docs.github.com/en/sponsors/sponsoring-open-source-contributors/about-sponsorships-fees-and-taxes "GitHub Sponsors fees and taxes"
[8]: https://help.buymeacoffee.com/en/articles/4539170-frequently-asked-questions "Buy Me a Coffee FAQ"
[9]: https://www.ethicalads.io/publishers/ "EthicalAds Publishers"
