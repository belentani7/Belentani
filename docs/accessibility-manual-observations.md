# Observaciones manuales de accesibilidad — 15 de agosto de 2026

La vista pública `/` se abrió localmente en Chromium con la identidad visual NOIACORE/Belentani. La extracción de contenido confirmó un enlace de inicio con nombre accesible, navegación con enlaces textuales para Catálogo, Recursos, Evolución y Contactar, dos llamadas a la acción principales y enlaces de pie con destinos explícitos. La jerarquía visible contiene un encabezado principal `Hacer visible lo que importa.` y encabezados secundarios para las secciones públicas.

La primera pulsación de Tab dejó el foco visible sobre el enlace de inicio, con un contorno claro y contraste suficiente contra el fondo negro. La interfaz conserva un orden de foco natural que empieza por la navegación superior y continúa hacia las llamadas a la acción. Esta observación no sustituye una auditoría completa por ruta, lector de pantalla y medición automatizada de contraste; las rutas `/catalogo`, `/agente`, `/recursos`, `/transparencia`, `/changelog`, `/admin`, el diálogo de autenticación y estados de error deben verificarse por separado.

Resultado provisional: no se observó un fallo crítico en el primer paso de foco ni en la identificación textual de los controles principales de `/`. La conformidad WCAG 2.1 AA no se declara todavía.

## Catálogo `/catalogo`

La ruta mostró un enlace de marca con destino `/`, un enlace `Volver al inicio`, un encabezado principal único, campo de búsqueda con placeholder descriptivo, selector de categoría con nombre accesible, campo de etiqueta, selector de ordenación y botón de filtros activos. El estado vacío comunica que no hay recursos publicados para el criterio y explica que la publicación depende de administración verificada; el contador indica `0 resultados · Página 1`. La revisión visual mostró contraste alto de texto contra negro/grafito y foco dibujado sobre los controles en la captura de Chromium. Esta comprobación no mide automáticamente ratios de contraste ni sustituye teclado completo de los controles de paginación.

## Agente `/agente`

La vista del agente presenta un enlace de marca y un enlace `Inicio`, un encabezado principal, el aviso visible de que las acciones sensibles permanecen bajo revisión humana, el estado `Fallback seguro activo` y el indicador `Contexto protegido`. El campo de consulta aparece con nombre accesible `Mensaje para el agente` y placeholder `Escribe una consulta...`; el botón de envío expone el hint `Enviar mensaje`. La superficie conserva contraste visual alto y una estructura de conversación reconocible. Pendiente: comprobar con lector de pantalla el anuncio de mensajes nuevos y probar los estados de error, espera y respuesta larga.

## Recursos `/recursos`

La biblioteca multimedia muestra un enlace de marca y un enlace `Inicio`, un encabezado principal y una descripción que explica la carga diferida. El estado vacío informa que la biblioteca está preparada para recibir recursos verificados y declara que no se muestran archivos inventados ni activos sin fuente. No aparecen controles multimedia sin nombre ni imágenes sin texto alternativo porque no hay recursos publicados. Pendiente: repetir la comprobación cuando existan vídeos, audios o documentos reales para validar controles nativos, subtítulos, transcripciones y alternativas equivalentes.

## Transparencia `/transparencia`

La ruta presenta navegación de retorno, encabezado principal `Criterio antes que comisión.` y un disclosure explícito sobre afiliación, patrocinios, donaciones y servicios profesionales. Las tarjetas separan selección, alternativas, contenido generado con IA y contacto; el enlace de correo aparece con destino y texto visibles. La jerarquía visual y el contraste se mantuvieron legibles en la captura. Pendiente: contrastar ratios de texto pequeño y revisar lectura lineal con lector de pantalla para confirmar el orden de las tarjetas.

## Changelog `/changelog`

La ruta presenta navegación de retorno, encabezado principal `Lo que cambia, queda visible.` y una explicación del propósito del registro. El estado vacío indica que la primera mejora documentada está en preparación y que el registro público se activará cuando exista una entrada publicada. La ausencia de controles editoriales en la superficie pública evita acciones ambiguas. Pendiente: comprobar la lectura accesible de fechas, autores y enlaces cuando existan entradas reales.

## Error 404

La ruta inexistente muestra el código `404`, el encabezado `Page Not Found`, una explicación breve y la acción `Go Home` como botón claramente identificado. El estado se presenta sobre una superficie grafito con texto claro y el foco del botón es visible en la captura. Pendiente: verificar navegación por teclado desde el primer foco y comportamiento de retorno en navegadores con historial complejo.
