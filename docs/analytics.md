# Analítica de negocio y privacidad

La plataforma registra únicamente eventos de embudo de baja sensibilidad a través de `client/src/lib/analytics.ts`. El objetivo es medir qué superficies públicas ayudan a descubrir el catálogo, usar el agente, consultar recursos y contactar con Belentani Studio, sin registrar el texto de las conversaciones, direcciones de correo, URLs de recursos ni identificadores directos de usuario.

| Evento                  | Superficie       | Propiedades permitidas          | Métrica derivada                                               |
| ----------------------- | ---------------- | ------------------------------- | -------------------------------------------------------------- |
| `catalog_opened`        | `/catalogo`      | Ninguna                         | Aperturas del catálogo y proporción sobre sesiones analíticas. |
| `agent_opened`          | `/agente`        | Ninguna                         | Aperturas del agente.                                          |
| `agent_query_submitted` | `/agente`        | `messageLength` numérico        | Consultas iniciadas y distribución de longitud, sin contenido. |
| `resource_opened`       | `/recursos`      | `surface` o `kind` de allowlist | Interés por biblioteca y formato multimedia.                   |
| `transparency_opened`   | `/transparencia` | Ninguna                         | Visitas a la divulgación comercial.                            |
| `contact_clicked`       | `/transparencia` | Ninguna                         | Conversión de contacto.                                        |

Los eventos se envían al proveedor analítico configurado por el proyecto mediante `umami` cuando existe, y también emiten un evento local `CustomEvent` para pruebas y extensiones futuras. La analítica no debe bloquear una acción de usuario: cualquier fallo se ignora de forma segura. No se deben añadir textos libres, emails, nombres, tokens, prompts, URLs privadas ni identificadores persistentes a las propiedades.

El proveedor de analítica, consentimiento, retención y exportación deben documentarse antes de activar medición en producción. Las decisiones de negocio deben utilizar datos agregados; no se debe intentar reconstruir perfiles individuales.


## Flujo backend verificable

Cada superficie pública llama a `trackBusinessEvent`. El helper envía el nombre de evento permitido al procedimiento tRPC `metrics.recordBusinessEvent`, sin transmitir el texto de la interacción ni propiedades sensibles. El backend valida el nombre contra una allowlist y actualiza contadores agregados en memoria mediante `recordBusinessEvent`. La consulta `metrics.public` devuelve el estado agregado al panel privado, donde se muestra en la tarjeta **Embudo público agregado** de `/admin` para usuarios autenticados y autorizados.

Este contador es operativo y efímero por proceso: no sustituye una base histórica ni una solución de analítica de producción con retención definida. Antes de utilizarlo para decisiones comerciales permanentes, se debe añadir persistencia agregada con límites de retención, consentimiento aplicable y pruebas de restauración. Los tests `server/business-analytics.test.ts` cubren los cuatro eventos de superficie, el procedimiento de registro y la consulta pública agregada.
