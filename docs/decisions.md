# Registro de decisiones y evolución

## Iteración NOIACORE LAB

Se decidió conservar literalmente textos, fuente del título, arquitectura de información y funcionalidades. El experimento se limitó a paleta fría, superficies oscuras, geometría sutil y ajustes cromáticos en estados heredados. El resultado se verificó en rutas públicas, administración, 404, diálogo y viewport móvil.

## Iteración de observabilidad

Se añadió persistencia agregada de eventos de negocio, un panel que combina embudo y rendimiento, una prueba HTTP con tRPC real y un registro reproducible de validación. Los eventos no guardan payloads textuales sensibles.

## Iteración de seguridad del agente

Se extrajo la política a `server/agentPolicy.ts`, se aplican límites de entrada, parser estricto de salida y revisión humana forzada para términos sensibles. Las salidas inválidas entran en el fallback seguro existente.

## Rollback

Cada bloque relevante se guarda mediante checkpoint recuperable. El último checkpoint estable es el que se adjunta en el chat; ante una regresión debe restaurarse desde el historial de versiones en lugar de usar un reset destructivo.
