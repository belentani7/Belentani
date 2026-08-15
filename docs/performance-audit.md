# Auditoría de rendimiento y carga inicial

## Resultado del build

La configuración de Vite separa React, router, query, tRPC, iconos, vendor y las rutas secundarias. El build actual genera un entry de aproximadamente 57.9 kB, un vendor de 101.4 kB y un chunk React de 441.4 kB sin superar el umbral de 500 kB; las rutas secundarias permanecen diferidas. Esto elimina la advertencia anterior del chunk `framework` de 504.98 kB.

## Imágenes, multimedia y fuentes

No se incluyen imágenes raster locales de gran tamaño en `client/public` ni en el bundle. La identidad visual se construye con CSS y geometría de fondo, por lo que no existe una descarga de imagen hero que optimizar. Los bytes multimedia se mantienen en storage de objetos y `Resources.tsx` usa `loading="lazy"` para vídeo y `preload="metadata"` para audio; la UI solo muestra recursos publicados.

La tipografía utiliza la fuente ya existente del proyecto y no añade una descarga externa obligatoria en esta iteración, respetando la instrucción de conservar la fuente del título. Esto reduce solicitudes bloqueantes y evita una dependencia adicional de rendimiento.

## Evidencia reproducible

La comprobación se reproduce con `pnpm build`. La carga inicial se revisa mediante el listado de assets generado por Vite y las capturas de las rutas públicas en desktop y 375 × 812 px. La medición de Core Web Vitals de laboratorio queda condicionada al entorno de navegador y hosting final; no se presenta como una medición de producción inexistente.
