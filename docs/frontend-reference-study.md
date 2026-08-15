# Estudio de referencia frontend

## Decisión

La referencia principal seleccionada es **shadcn/ui** junto con sus primitivas Radix y el sistema de tokens de Tailwind CSS. La plataforma ya utiliza esta familia de componentes y, por tanto, el mayor beneficio consiste en reforzar la consistencia y accesibilidad sin introducir una biblioteca paralela.

| Fuente | Hallazgo verificable | Aplicación compatible |
| --- | --- | --- |
| [shadcn/ui](https://ui.shadcn.com/) | Componentes abiertos, personalizables y con código que el proyecto puede poseer y adaptar. | Mantener componentes locales bajo `client/src/components/ui` y conservar la identidad negra/gris piedra propia. |
| [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction) | Primitivas orientadas a accesibilidad, gestión de foco, navegación por teclado y adopción incremental. | Reutilizar los componentes ya presentes para diálogos, menús, selectores y controles; no duplicar patrones accesibles manualmente. |
| [Tailwind theme variables](https://tailwindcss.com/docs/theme) | Los tokens de diseño se expresan mediante variables de tema que generan utilidades y reducen deriva visual. | Mantener tokens semánticos CSS y `@theme inline`; validar contraste, motion y estados desde la suite. |

## Traducción al producto

La referencia no justifica añadir dependencias de runtime ni copiar una estética genérica. NOIACORE LAB conserva su composición editorial, la fuente del título, la paleta absoluta de negro, grafito, gris piedra y blanco espectral, y el límite de movimiento interactivo de 200 ms. La mejora compatible consiste en seguir usando componentes con contratos claros, nombres accesibles, foco visible, estados loading/error/empty y tokens centralizados.

Se verificó que el inventario interno ya contiene los componentes necesarios para Admin, diálogos, formularios, tablas, menús, selectores, alertas y superficies de datos. La decisión de no añadir código de terceros está documentada en `docs/repo-integration-decision.md`.

## Referencias

[1]: https://ui.shadcn.com/ "shadcn/ui — The Foundation for your Design System"
[2]: https://www.radix-ui.com/primitives/docs/overview/introduction "Radix Primitives — Introduction"
[3]: https://tailwindcss.com/docs/theme "Tailwind CSS — Theme variables"
