# Design system de Belentani Studio

El sistema visual utiliza una atmósfera oscura, cinematográfica y silenciosa, con negro absoluto, azules profundos desaturados, blancos fríos espectrales y líneas de luz muy sutiles. La intención perceptiva mantiene **figura y fondo** inequívocos, agrupa por **proximidad y semejanza**, y reserva el acento frío para acciones, foco y estados relevantes. La tipografía, los textos, la estructura y el propósito de la plataforma permanecen sin cambios; solo se transforma la piel cromática y atmosférica.

## Paleta visual aplicada

| Rol              | Valor     | Uso                                           |
| ---------------- | --------- | --------------------------------------------- |
| Fondo principal  | `#000000` | Superficie global y espacio negativo          |
| Azul profundo 1  | `#0A1628` | Sidebar, superficies secundarias y navegación |
| Azul profundo 2  | `#0F1C2E` | Cards, popovers y diálogos                    |
| Azul profundo 3  | `#15233A` | Muted, acentos de superficie y geometría      |
| Blanco frío      | `#E8F0FF` | Texto principal y acciones primarias          |
| Blanco espectral | `#F5F8FF` | Texto destacado y superficies de control      |
| Señal fría       | `#B9CBED` | Foco, bordes luminosos y estados              |

## Tokens verificables

Los tokens viven en `client/src/index.css`: `--brand-ink`, `--brand-paper`, `--brand-signal`, `--brand-hairline`, `--brand-radius-card`, `--brand-radius-pill`, `--brand-space-unit`, `--brand-ease-out`, `--brand-ease-in-out`, `--brand-motion-fast` y `--brand-motion-standard`.

## Motion principles

Las transiciones deben afectar principalmente `transform` y `opacity`, usar `--brand-ease-out` para entrada y mantenerse por debajo de 300 ms. Los botones pueden usar una respuesta activa de escala aproximada de `0.97`. No se deben animar propiedades que provoquen layout salvo una necesidad documentada. `prefers-reduced-motion: reduce` elimina transformaciones y transiciones no esenciales.

## Accesibilidad perceptiva

Todo foco de teclado debe permanecer visible mediante `.brand-focus-ring`. El contraste debe revisarse con cada combinación de fondo y texto. Las etiquetas, estados, botones y formularios deben conservar nombres accesibles aunque se reduzca el movimiento o se desactive el color.

## Tabla de tokens vinculados al código

| Familia            | Tokens                                                                                                            | Ubicación                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Tipografía         | `--brand-font-display`, `--brand-font-body`, `--brand-font-size-*`, `--brand-leading-*`                           | `client/src/index.css`                           |
| Espaciado y radios | `--brand-space-unit`, `--brand-radius-card`, `--brand-radius-pill`                                                | `client/src/index.css`                           |
| Color              | `--brand-ink`, `--brand-paper`, `--brand-signal`, `--brand-hairline`                                              | `client/src/index.css`                           |
| Sombras            | `--brand-shadow-card`, `--brand-shadow-focus`                                                                     | `client/src/index.css`                           |
| Iconografía        | `--brand-icon-size-sm`, `--brand-icon-size-md`, `--brand-icon-size-lg`, `--brand-icon-stroke`, `.brand-icon`      | `client/src/index.css`; iconos Lucide en páginas |
| Motion             | `--brand-ease-out`, `--brand-ease-in-out`, `--brand-motion-fast`, `--brand-motion-standard`, `.brand-interactive` | `client/src/index.css`                           |

## Auditoría de motion de superficies

| Superficie     | Motion observado                                                     | Duración/límite                                          | Reducción de movimiento                                   |
| -------------- | -------------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| Landing        | Transiciones de botones, enlaces y tarjetas; entrada visual estática | 140–220 ms en `.brand-interactive`; sin keyframes largos | Se eliminan transformaciones y transiciones no esenciales |
| Catálogo       | Hover de tarjetas y respuesta de botones                             | Menor de 300 ms; transform y borde                       | El media query global desactiva la transición             |
| Agente         | Estados de carga y respuesta; sin animación ornamental continua      | Feedback controlado por estado                           | El contenido sigue siendo accesible sin motion            |
| Recursos       | Skeleton de carga y carga diferida por IntersectionObserver          | Skeleton solo durante carga; sin bucles                  | Se mantienen los estados y se elimina motion no esencial  |
| Administración | Estados de mutación y feedback de controles                          | Transiciones cortas del sistema                          | Foco y estado no dependen del movimiento                  |

La auditoría se limita a las superficies existentes y debe repetirse cuando se incorpore un componente con `animate-*`, `transition-*`, `@keyframes` o motion library. La aceptación requiere comprobar visualmente el modo normal y `prefers-reduced-motion: reduce`.

## Inventario exhaustivo de motion revisado

La revisión recursiva del frontend identificó motion en las siguientes familias:

| Área                | Archivos o patrón                                                | Tratamiento                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Páginas             | `Home.tsx`, `Catalog.tsx`, `Resources.tsx`, `NotFound.tsx`       | Transiciones de color, escala, desplazamiento, skeleton y spinner; los estados de carga son funcionales y la media query global los reduce al mínimo. |
| Componentes UI      | `button`, `switch`, `tabs`, `table`, `textarea`, `toggle`        | Transiciones de color, sombra y transform de Radix/shadcn; no se usan timers propios ni animaciones persistentes.                                     |
| Componentes overlay | `tooltip.tsx` y componentes Radix con `animate-in`/`animate-out` | Motion de entrada/salida dependiente del componente; queda neutralizado por `prefers-reduced-motion: reduce` mediante las reglas globales.            |
| Sistema global      | `client/src/index.css`                                           | Define la política global de reducción de movimiento y los tokens `brand-*`; no contiene keyframes de negocio.                                        |

Criterio aplicado: no se encontraron `setInterval`, `requestAnimationFrame` ni animaciones JavaScript persistentes en el frontend. Las transiciones detectadas son de interacción o feedback, y la política global reduce su duración a `0.01ms` cuando el usuario solicita menos movimiento. Las animaciones de skeleton y spinner se consideran estados funcionales; conservan su contenido y significado cuando se reducen.

## Matriz exhaustiva por archivo/componente

| Archivo/componente                             | Tipo detectado              | Duración o regla                       | Reversible | Funcional/no esencial | `prefers-reduced-motion` | Estado   |
| ---------------------------------------------- | --------------------------- | -------------------------------------- | ---------- | --------------------- | ------------------------ | -------- |
| `client/src/components/AIChatBox.tsx`          | Transiciones de interacción | Tokens/clases del componente           | Sí         | Feedback              | Global                   | Conforme |
| `client/src/components/DashboardLayout.tsx`    | Transición de navegación    | Tokens/clases del componente           | Sí         | Navegación            | Global                   | Conforme |
| `client/src/components/ui/accordion.tsx`       | Apertura/cierre             | Radix; neutralizada globalmente        | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/alert-dialog.tsx`    | Entrada/salida modal        | Radix; neutralizada globalmente        | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/badge.tsx`           | Transición de estados       | Corta; color/borde                     | Sí         | No esencial           | Global                   | Conforme |
| `client/src/components/ui/breadcrumb.tsx`      | Transición de enlaces       | Corta; color                           | Sí         | No esencial           | Global                   | Conforme |
| `client/src/components/ui/button.tsx`          | Hover/focus                 | Corta; color/sombra                    | Sí         | Feedback              | Global                   | Conforme |
| `client/src/components/ui/checkbox.tsx`        | Estado marcado              | Radix; transform/color                 | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/context-menu.tsx`    | Entrada/salida              | Radix; neutralizada globalmente        | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/dialog.tsx`          | Entrada/salida              | Radix; neutralizada globalmente        | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/drawer.tsx`          | Deslizamiento               | Radix; neutralizada globalmente        | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/dropdown-menu.tsx`   | Entrada/salida              | Radix; neutralizada globalmente        | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/hover-card.tsx`      | Entrada/salida              | Radix; neutralizada globalmente        | Sí         | No esencial           | Global                   | Conforme |
| `client/src/components/ui/input-group.tsx`     | Focus/estado                | Corta; color/sombra                    | Sí         | Feedback              | Global                   | Conforme |
| `client/src/components/ui/input-otp.tsx`       | Focus/estado                | Corta; color/sombra                    | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/input.tsx`           | Focus/estado                | Corta; color/sombra                    | Sí         | Feedback              | Global                   | Conforme |
| `client/src/components/ui/item.tsx`            | Hover/estado                | Corta; color                           | Sí         | No esencial           | Global                   | Conforme |
| `client/src/components/ui/menubar.tsx`         | Menú                        | Radix; neutralizada globalmente        | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/navigation-menu.tsx` | Menú                        | Radix; neutralizada globalmente        | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/popover.tsx`         | Entrada/salida              | Radix; neutralizada globalmente        | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/progress.tsx`        | Progreso                    | Transformación funcional               | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/radio-group.tsx`     | Estado seleccionado         | Corta; color                           | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/scroll-area.tsx`     | Scroll/estado               | Corta; interacción                     | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/select.tsx`          | Entrada/salida              | Radix; neutralizada globalmente        | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/sheet.tsx`           | Deslizamiento               | Radix; neutralizada globalmente        | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/sidebar.tsx`         | Apertura/cierre             | Transición de layout                   | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/skeleton.tsx`        | Pulso de carga              | Estado funcional; reducido globalmente | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/slider.tsx`          | Desplazamiento              | Transformación funcional               | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/spinner.tsx`         | Giro de carga               | Estado funcional; reducido globalmente | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/switch.tsx`          | Desplazamiento de thumb     | Transformación corta                   | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/table.tsx`           | Hover/selección             | Corta; color                           | Sí         | No esencial           | Global                   | Conforme |
| `client/src/components/ui/tabs.tsx`            | Cambio de pestaña           | Corta; color/sombra                    | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/textarea.tsx`        | Focus/estado                | Corta; color/sombra                    | Sí         | Feedback              | Global                   | Conforme |
| `client/src/components/ui/toggle.tsx`          | Estado activo               | Corta; color                           | Sí         | Funcional             | Global                   | Conforme |
| `client/src/components/ui/tooltip.tsx`         | Entrada/salida              | Radix animate-in/out; global           | Sí         | No esencial           | Global                   | Conforme |
| `client/src/index.css`                         | Política global             | `0.01ms` en reduce                     | Sí         | Infraestructura       | Nativa                   | Conforme |
| `client/src/pages/Catalog.tsx`                 | Skeleton, spinner, hover    | Skeleton funcional; hover 200 ms       | Sí         | Mixto                 | Global                   | Conforme |
| `client/src/pages/Home.tsx`                    | Hover, rotación, elevación  | 200 ms                                 | Sí         | No esencial           | Global                   | Conforme |
| `client/src/pages/NotFound.tsx`                | Pulso y hover               | Pulso funcional; hover 200 ms          | Sí         | Mixto                 | Global                   | Conforme |
| `client/src/pages/Resources.tsx`               | Skeleton de carga           | Estado funcional; reducido globalmente | Sí         | Funcional             | Global                   | Conforme |

La matriz se construyó a partir del inventario recursivo de clases `animate-*`, `transition-*`, `@keyframes`, Framer Motion y Motion. Las entradas Radix/shadcn dependen de la política global; ninguna utiliza timers de proceso ni movimiento esencial para comprender o completar la tarea.

La matriz verificable por coincidencia exacta se genera en `docs/motion-audit-exact.md` desde `docs/motion-audit-raw.txt` mediante `node scripts/generate_motion_audit.mjs`. Contiene las 85 coincidencias detectadas con archivo, línea, origen, tipo, duración, reversibilidad, función, reducción de movimiento y estado. Debe regenerarse después de modificar cualquier página o componente con motion.
