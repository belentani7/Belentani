# Hallazgos de repositorios públicos

La búsqueda se realizó mediante GitHub CLI y se contrastó con las páginas oficiales de los repositorios. La selección prioriza repositorios públicos, activos, con documentación y licencia identificable.

| Repositorio | Señales observadas | Licencia | Encaje potencial |
|---|---|---|---|
| [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | 121.350 estrellas, 2.382 commits, descripción orientada a componentes accesibles y personalizables | MIT | Referencia para sistema de componentes; el proyecto ya usa componentes compatibles, por lo que conviene reutilizar patrones sin sustituir la identidad NOIACORE. |
| [dequelabs/axe-core](https://github.com/dequelabs/axe-core) | 7.403 estrellas, 5.519 commits, motor de pruebas automatizadas de accesibilidad | MPL-2.0 | Candidato para ampliar la auditoría WCAG automatizada; requiere conservar revisión manual y revisar dependencias de terceros. |
| [drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm) | 35.484 estrellas, 2.939 commits, ORM TypeScript para PostgreSQL/MySQL/SQLite y diseño serverless | Apache-2.0 | Ya coincide con el stack; sirve como referencia de migraciones y consultas, no requiere reemplazo. |
| [motiondivision/motion](https://github.com/motiondivision/motion) | 33.245 estrellas, 7.832 commits, librería de animación React/JavaScript/Vue con tests y tree-shaking | MIT | Referencia para motion avanzado, pero no se incorpora automáticamente porque la política del proyecto limita la animación interactiva y el fondo ambiental ya está implementado en CSS. |

La búsqueda también detectó candidatos de calidad insuficiente para integración directa: repositorios sin licencia identificable, muy pocos seguidores, actividad antigua o descripciones demasiado genéricas. No se integrará código de esos candidatos sin una revisión independiente de licencia, seguridad y mantenimiento.

## Criterio de aplicación

La primera aplicación de valor inmediato es usar `axe-core` como candidato para una futura prueba de accesibilidad por ruta, porque el backlog mantiene pendiente una auditoría WCAG verificable. Para frontend y motion se conservarán los componentes y tokens actuales, evitando dependencias nuevas cuando no aporten una mejora demostrable. Drizzle, Zod, Testing Library y Radix se mantienen como referencias alineadas con las dependencias ya presentes.

La evaluación no autoriza copiar código, importar activos ni alterar contratos del producto. Cada incorporación requerirá comprobar la licencia del paquete concreto, revisar vulnerabilidades, cubrirla con tests y guardar evidencia del cambio.
