# Auditoría responsive y mobile-first

La revisión se realizó en viewport de 375 × 812 px sobre las superficies públicas y administrativas principales. Se verificaron navegación, titulares, botones, filtros, cards, audio, métricas y estados visuales sin modificar textos ni arquitectura.

| Superficie o estado           | Evidencia y resultado                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `/`                           | Navegación compacta, título fluido, CTAs apilados y geometría sin desbordamiento.                                               |
| `/catalogo`                   | Búsqueda, categoría, etiqueta y ordenación ocupan el ancho disponible; las grids pasan a una columna.                           |
| `/agente`                     | Encabezado, conversación y mensajes permanecen contenidos; la tarjeta usa `overflow-hidden`.                                    |
| `/recursos`                   | Biblioteca vacía y reproductores usan `w-full`; la grid se adapta a una columna.                                                |
| `/transparencia`              | Disclosure y cards mantienen lectura vertical y márgenes seguros.                                                               |
| `/changelog`                  | Registro editorial mantiene jerarquía vertical y ancho limitado.                                                                |
| `/admin`                      | Header, configuración, métricas, formularios y controles usan columnas fluidas y stacks en móvil.                               |
| `/404` y fallback desconocido | Card, texto y botón ocupan el ancho disponible sin overflow.                                                                    |
| Estados de catálogo           | El código mantiene skeleton, error/retry, empty y success dentro de grids responsive.                                           |
| Diálogo de autenticación      | `DialogContent` y botón usan ancho completo dentro de una superficie acotada; revisión visual realizada con el diálogo abierto. |

La revisión por código confirma breakpoints `sm`, `md` y `lg` para cambiar grids y filas, `max-w-*` para limitar lectura, `w-full` para controles y `overflow-hidden` en superficies potencialmente largas. No se detectó una regla que fuerce ancho fijo incompatible con 375 px en las rutas auditadas.
