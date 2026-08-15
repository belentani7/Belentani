# Auditoría de accesibilidad WCAG 2.1 AA

La revisión final combina inspección estática del código, verificación de estilos globales y revisión visual responsive previamente registrada. No se presentan como pruebas de conformidad formal las comprobaciones que requieren lector de pantalla o usuarios reales.

| Área               | Evidencia revisada                                                                                                                                    | Resultado                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Landmarks          | Las páginas públicas principales usan `main`, `header` y `nav`; el panel usa `main` y navegación persistente                                          | Conforme a la estructura observada                                         |
| Jerarquía          | Las páginas principales exponen un `h1`; 404 y administración tienen encabezados de estado                                                            | Conforme                                                                   |
| Nombres accesibles | Búsqueda, filtros, paginación, agente y acciones administrativas tienen `aria-label` o texto visible; la imagen de `ManusDialog` tiene `alt`          | Conforme en inspección estática                                            |
| Teclado y foco     | Componentes Radix/shadcn conservan `focus-visible`; la identidad añade `brand-focus-ring` con contraste y offset                                      | Conforme en CSS inspeccionado                                              |
| Formularios        | Campos relevantes usan `Label` con `htmlFor`, `aria-label` o componentes Radix con nombre propio                                                      | Conforme en páginas funcionales; la galería de componentes es demostrativa |
| Contraste          | La paleta NOIACORE usa negro absoluto, grafito, gris piedra y blancos espectrales; debe confirmarse con medición sobre cada estado dinámico           | Revisión visual; pendiente de medición automatizada exhaustiva             |
| Movimiento         | Transiciones de interacción limitadas y regla `prefers-reduced-motion: reduce` presente                                                               | Conforme a la política de motion documentada                               |
| Errores y estados  | Catálogo, agente y administración muestran estados de carga, vacío y error; los límites de red y recuperación están cubiertos por pruebas server-side | Conforme funcionalmente; lector de pantalla no verificado                  |

La conclusión operativa es que no se detectaron hallazgos concretos bloqueantes en la inspección estática. Permanece como buena práctica una pasada manual con teclado y lector de pantalla antes de declarar conformidad legal o certificación WCAG.

## Evidencia adicional de esta iteración

Se inspeccionaron manualmente en Chromium las rutas `/`, `/catalogo`, `/agente`, `/recursos`, `/transparencia` y `/changelog`. La matriz detallada está en `docs/accessibility-manual-observations.md`. Se verificaron nombres visibles de navegación, encabezados principales, campos de búsqueda/filtro, botón de envío del agente, estados vacíos, disclosure de transparencia, enlaces de contacto y foco visible en el primer paso de teclado de la vista pública.

Se añadió `server/accessibility.audit.test.ts`, que ejecuta `axe-core 4.13` sobre un contrato semántico compartido con `happy-dom`; el resultado actual es **0 violaciones en 1 prueba automatizada**. Este smoke audit valida landmarks, idioma, encabezados, formulario, asociación label/input, botón y enlaces representativos. No equivale a una auditoría completa de cada ruta renderizada, ratios de contraste por estado, lector de pantalla ni pruebas con usuarios.

La conformidad WCAG 2.1 AA completa continúa sin declararse hasta completar una pasada exhaustiva por todas las rutas, estados dinámicos y tecnologías de asistencia.
