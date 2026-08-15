# Integración teórica de NOIACORE LAB

## Alcance

Este documento convierte cuatro marcos conceptuales solicitados para NOIACORE LAB en decisiones de diseño verificables. No presenta ninguna teoría como una garantía de conversión, diagnóstico psicológico o sustituto de investigación con usuarios. Las decisiones deben validarse con pruebas de accesibilidad, analítica agregada y observación cualitativa sin registrar datos sensibles.

## Matriz de aplicación

| Marco              | Evidencia consultada                                                                                                                                                                                                                             | Aplicación prudente en la plataforma                                                                                                                                                                | Evidencia local                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Gestalt            | Los principios Gestalt explican cómo los elementos de una interfaz pueden percibirse como un conjunto o como unidades separadas [1].                                                                                                             | Agrupar navegación, CTA y contexto mediante proximidad, región común, contraste figura/fondo y continuidad; usar espacio negativo en lugar de añadir más estímulos.                                 | `client/src/pages/Home.tsx` organiza pilares, catálogo, recursos y agente en superficies y secciones distinguibles.                   |
| Teoría de la mente | Se utiliza aquí como una hipótesis de diseño conversacional, no como lectura de estados mentales.                                                                                                                                                | El agente debe reconocer incertidumbre, pedir contexto cuando falte, explicar límites y mantener revisión humana para acciones sensibles.                                                           | `server/agentPolicy.ts`, `server/privateData.ts` y la política de revisión humana documentan límites, fallback y separación de datos. |
| Metacognición      | MIT describe la metacognición como planificar, monitorizar y evaluar el progreso; también recomienda preguntas y listas de comprobación explícitas [2]. La revisión científica distingue conocimiento metacognitivo y control metacognitivo [3]. | Convertir el catálogo en una herramienta de decisión: mostrar contexto, fuente, estado de revisión, fecha de ingesta y próximos pasos; en el agente, permitir reformular y revisar antes de actuar. | El catálogo conserva procedencia y estados editoriales; el agente valida salida y no envía comunicaciones externas automáticamente.   |
| Escaparatismo      | Un estudio experimental sobre escaparates concluye que el efecto de una presentación depende de la motivación de compra y de la carga cognitiva; no es una regla universal [4].                                                                  | Tratar la portada como escaparate editorial: una propuesta principal, tres rutas de entrada y señales de profundidad; evitar promesas agresivas, patrones oscuros o presión artificial.             | `Home.tsx` mantiene un hero, rutas de catálogo/recursos/agente y tarjetas de exploración con jerarquía clara.                         |

## Principios de implementación

La interfaz debe ofrecer una primera lectura rápida y una segunda lectura profunda. La primera lectura utiliza contraste, jerarquía y proximidad para orientar la atención; la segunda lectura revela fuente, estado, contexto y límites. Esta estructura satisface el objetivo editorial sin saturar la pantalla con más tarjetas, claims o animaciones.

La armonía visual se implementa como consistencia medible: negro absoluto y superficies grafito, gris piedra como señal secundaria, blancos espectrales para lectura, bordes de baja intensidad y un único lenguaje de interacción. La atmósfera ambiental lenta se limita al fondo y se desactiva con `prefers-reduced-motion`; las interacciones permanecen breves y reversibles.

El agente no debe simular certeza psicológica. Puede inferir una intención operativa a partir del texto proporcionado, pero debe mostrar incertidumbre cuando la clasificación no sea clara, evitar atribuir emociones o rasgos al usuario y solicitar confirmación antes de crear una respuesta sensible. La revisión humana conserva la decisión final.

## Validación pendiente

La matriz no equivale a una certificación de usabilidad. Antes del cierre se recomienda una prueba manual con teclado y lector de pantalla, una medición de contraste por estado interactivo, una prueba de comprensión con usuarios y una revisión de los eventos agregados del embudo. Las métricas deben medir orientación y finalización sin registrar el contenido de conversaciones ni datos personales.

## Referencias

[1]: https://www.nngroup.com/videos/the-gestalt-principles-intro/ "The Gestalt Principles for User Interface Design — Nielsen Norman Group"
[2]: https://tll.mit.edu/teaching-resources/how-people-learn/metacognition/ "Metacognition — MIT Teaching + Learning Lab"
[3]: https://pmc.ncbi.nlm.nih.gov/articles/PMC8187395/ "Metacognition: ideas and insights from neuro- and educational sciences — NPJ Science of Learning"
[4]: https://www.sciencedirect.com/science/article/abs/pii/S0969698911000889 "How do storefront window displays influence entering decisions of clothing stores? — Journal of Retailing and Consumer Services"
