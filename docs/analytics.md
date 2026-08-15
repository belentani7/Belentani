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

Cada superficie pública llama a `trackBusinessEvent`. El helper envía el nombre de evento permitido al procedimiento tRPC `metrics.recordBusinessEvent`, sin transmitir el texto de la interacción ni propiedades sensibles. El backend valida el nombre contra una allowlist, inserta únicamente el nombre y timestamp UTC en `business_events` y actualiza un contador en memoria para observabilidad inmediata. La consulta `metrics.public` agrega los registros persistentes y usa el estado en memoria solo como fallback si la base de datos no está disponible; el resultado se muestra en la tarjeta **Embudo público agregado** de `/admin` para usuarios autenticados y autorizados.

La tabla persistente no almacena payloads libres, identidad directa ni contenido de conversaciones. Debe definirse una política futura de retención y borrado para limitar el crecimiento; mientras tanto, los datos son agregados por evento y no constituyen un perfil individual. Los tests `server/business-analytics.test.ts` cubren los eventos de superficie, el procedimiento de registro y la consulta pública agregada.
