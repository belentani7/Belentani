# Prompt maestro de identidad visual — NOIACORE LAB

## Modo de ejecución

Actúa exclusivamente como director de arte senior, diseñador de sistemas visuales y especialista en interfaces digitales premium. Redefine la **identidad visual** de la interfaz existente de NOIACORE LAB sin alterar su semántica, arquitectura ni comportamiento. El objetivo es que la web se perciba como un **laboratorio digital silencioso, oscuro, preciso, tecnológico, contemplativo, monumental y evolutivo**, no como una plantilla genérica de startup.

> **Regla absoluta:** no cambies textos, claims, nombres, orden de secciones, rutas, estructura JSX, arquitectura de información, botones, formularios, contratos de datos, funcionalidades ni flujos de usuario. Solo modifica la piel visual: tokens, color, superficies, bordes, geometría, tratamiento cromático, espaciado visual, profundidad, estados interactivos y microinteracciones.

## Universo semántico y vocabulario de dirección de arte

Usa de forma coherente, no ornamental, este campo semántico: **laboratorio digital, núcleo de inteligencia, arquitectura invisible, infraestructura cognitiva, materia oscura tecnológica, campo de percepción, interfaz espectral, sistema orbital, centro de operaciones, observatorio de señales, red de conocimiento, cámara de datos, plano de precisión, geometría sagrada, silencio operativo, vacío cósmico, agua negra, espejo profundo, horizonte nocturno, atmósfera cinematográfica, monumentalidad serena, minimalismo ceremonial, lujo silencioso, tecnología contenida, precisión editorial, inteligencia latente, energía fría, luz espectral, presencia invisible, profundidad abisal, inmersión controlada, continuidad, trazabilidad, evolución, densidad informativa ordenada, claridad fría, calma estructural, concentración, foco, gravedad visual y expansión contenida**.

Las variantes descriptivas permitidas para los fondos son: **negro absoluto, vacío negro, oscuridad nítida, espacio sin ruido, campo nocturno, superficie abisal, fondo cósmico sobrio, plano profundo, cámara oscura digital, horizonte sin horizonte**. Para las superficies: **azul noche desaturado, vidrio oscuro, cristal ahumado frío, agua negra reflectante, placa de obsidiana digital, panel de laboratorio, membrana translúcida, plano azul profundo, superficie de datos contenida**. Para la luz: **blanco espectral, resplandor glacial, iluminación lunar fría, línea vertical de señal, brillo de baja intensidad, halo controlado, reflejo azul-blanco, luminiscencia mínima, señal tenue, luz de precisión**. Para la interacción: **respuesta serena, transición flotante, confirmación silenciosa, foco visible, elevación mínima, pulso de señal, aparición de anillo, revelación progresiva, continuidad suave, navegación ceremonial**.

No uses estos conceptos para añadir copy, títulos, slogans o contenido nuevo. Son únicamente referencias internas para tomar decisiones visuales.

## Tokens visuales obligatorios

Implementa o conserva estos tokens como fuente de verdad. No adivines colores, fuentes, radios ni curvas de interacción.

```css
:root {
  --noiacore-bg: #000000;
  --noiacore-surface-100: #0a1628;
  --noiacore-surface-200: #0f1c2e;
  --noiacore-surface-300: #15233a;
  --noiacore-surface-400: #1a2a40;
  --noiacore-spectral-100: #e8f0ff;
  --noiacore-spectral-200: #f5f8ff;
  --noiacore-spectral-300: #f0f4ff;
  --noiacore-hairline: rgba(232, 240, 255, 0.1);
  --noiacore-glass: rgba(10, 22, 40, 0.4);
  --noiacore-glass-blur: 12px;
  --noiacore-ease: cubic-bezier(0.16, 1, 0.3, 1);
}
```

En Tailwind, mapea estos valores a tokens semánticos equivalentes: `bg-black`, superficies `#0A1628`, `#0F1C2E`, `#15233A`, `#1A2A40`, blancos `#E8F0FF`, `#F5F8FF`, `#F0F4FF`, bordes `border-white/10` o su equivalente tokenizado, y superficies translúcidas como `bg-[#0A1628]/40`. No sustituyas estos valores por colores aproximados, cálidos, saturados o neón.

## Paleta y contraste

El fondo principal debe ser **negro absoluto**. Las superficies deben avanzar en profundidad desde azul noche desaturado hasta azul pizarra profundo. Los blancos deben ser fríos, espectrales y legibles. Los acentos se limitan a una iluminación blanco-azulada tenue. Quedan prohibidos el rojo, naranja, amarillo, verde, magenta, violeta saturado, cian neón, gradientes vibrantes y cualquier tratamiento cálido.

Usa la luz para jerarquía, no para decoración. Los estados hover, focus, active, success, error y disabled deben conservar significado accesible mediante contraste, texto, iconografía o estado estructural; nunca dependas únicamente del resplandor o del color.

## Tipografía y composición

Conserva la fuente actual del título y cualquier decisión tipográfica aprobada. Usa una sans-serif geométrica, sobria, contemporánea y altamente legible para el resto del sistema. Prioriza pesos finos y regulares, tracking abierto, interlineado generoso, jerarquía silenciosa y contraste de escala controlado. Evita tipografías display decorativas, redondeadas, condensadas, excesivamente futuristas o agresivas.

Utiliza contenedores con **max-width contenido**, `px-8` cuando el viewport lo permita y espaciado vertical amplio equivalente a `py-24`–`py-36` solo cuando no altere la estructura existente. Prioriza el espacio negativo, la respiración visual, la simetría casi perfecta y layouts de una o dos columnas. No aprietes la interfaz en grids densos de tres o cuatro columnas si la estructura existente permite una presentación más contenida; no cambies el número de bloques ni la arquitectura funcional para conseguirlo.

## Superficies, bordes y profundidad

Las cards y contenedores deben sentirse como **placas oscuras suspendidas**, paneles de observación o superficies de agua negra. Usa bordes de baja intensidad, por ejemplo `border border-white/10`, o gradientes verticales mínimos como `bg-gradient-to-b from-white/10 to-transparent`. Usa `backdrop-blur-md` solo sobre superficies semitransparentes y con contraste suficiente: `bg-[#0A1628]/40 backdrop-blur-md`.

Los bordes deben ser finos, casi imperceptibles y útiles para separar grupos. El resplandor debe ser difuso, pequeño y frío. Evita sombras pesadas, neomorfismo, efectos 3D, biseles brillantes, texturas ruidosas y exceso de glassmorphism.

## Geometría y lenguaje gráfico

Usa círculos, anillos concéntricos, líneas verticales, retículas apenas visibles, halos radiales, divisores finos y campos geométricos suaves. Cada elemento geométrico debe reforzar jerarquía, orientación o profundidad; si no cumple una función perceptiva, elimínalo. La geometría sagrada debe ser abstracta y sobria, nunca esotérica de forma literal ni ornamental.

La imagen mental es un sistema orbital de precisión: un núcleo, capas de profundidad, señales discretas y un horizonte frío. Las partículas deben ser escasas. No añadas ruido, decoraciones aleatorias, estrellas abundantes ni patrones que compitan con el contenido.

## Componentes e interacciones

Los botones deben ser sobrios, legibles y precisos, con relleno frío sutil o borde fino. Los campos deben integrarse en la oscuridad, mantener foco visible y conservar estados de error comprensibles. Las cards deben tener jerarquía por superficie y espacio, no por sombras agresivas. Los separadores deben parecer líneas de señal muy tenues.

Usa transiciones elegantes con `ease-out` o `cubic-bezier(0.16, 1, 0.3, 1)`, pero respeta la política operativa del proyecto: ninguna transición o animación interactiva debe superar **200 ms**. La referencia estética de 700–1000 ms queda reinterpretada como intención de suavidad, no como duración literal, porque la web debe conservar respuesta rápida, accesibilidad y consistencia con `prefers-reduced-motion`. Anima únicamente `transform` y `opacity` cuando sea posible. No uses rebotes, overshoot llamativo, escalas desde cero, parallax agresivo ni desplazamientos que reordenen el layout.

Estados permitidos: aumento mínimo de luminosidad, aparición de un hairline, pulso corto de señal, desplazamiento de 1–2 px, escala active aproximada de `0.97`, foco espectral y revelación de contenido ya existente. Respeta `prefers-reduced-motion: reduce` y elimina cualquier movimiento no esencial.

## Imágenes y multimedia

Cuando ya existan imágenes, conserva su función y tratamiento editorial. Si se requiere dirección cromática, prioriza desaturación controlada, contraste preciso, iluminación vertical fría, figuras contemplativas, agua negra, niebla etérea y vacío cósmico sobrio. Evita lifestyle comercial, sonrisas posadas, colores cálidos, recortes agresivos, exceso de grano, neón y composiciones estridentes. No inventes testimonios, reseñas, ratings, personas, resultados ni contenido editorial.

## Accesibilidad e integridad

Conserva nombres accesibles, labels, landmarks, foco visible, orden de teclado, contraste, estados de error, textos alternativos y semántica HTML. No ocultes información importante detrás de hover. No sustituyas texto por iconos ambiguos. No cambies ningún copy, claim, label o estructura existente para hacer que la estética parezca más coherente.

## Criterios de aceptación

La aplicación final debe parecer nacida dentro del universo **NOIACORE LAB**: oscura, fría, espectral, precisa, silenciosa, monumental, cinematográfica, tecnológica, contenida, contemplativa, profunda y evolutiva. Debe sentirse como entrar en un campo de inteligencia invisible que ya existía antes de la llegada del usuario.

La implementación solo se acepta si conserva literalmente los textos y el orden de los bloques, mantiene las funcionalidades y contratos, usa los tokens definidos, no incorpora tonos prohibidos, mantiene las animaciones dentro de 200 ms, respeta `prefers-reduced-motion`, conserva el foco accesible y supera typecheck, lint, tests y build.

## Instrucción para herramientas de rediseño

Para un proyecto nuevo, comienza con: **“Genera la UI en React + Tailwind CSS aplicando estrictamente el siguiente contrato visual de NOIACORE LAB.”**

Para un proyecto existente, comienza con: **“Reescribe únicamente clases Tailwind, tokens CSS, estilos y tratamiento visual de los componentes adjuntos. No alteres JSX estructural, textos, rutas, contratos, contenido ni funcionalidades. Aplica estrictamente el contrato visual NOIACORE LAB y verifica que todas las animaciones permanezcan por debajo de 200 ms.”**
