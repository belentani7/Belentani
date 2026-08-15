# Evidencia de integración Gmail

La inspección del conector Gmail se realizó el 15 de agosto de 2026 mediante el servidor Gmail configurado en la sesión.

| Herramienta             | Capacidad                                                                    | Uso permitido en esta integración                                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `gmail_search_messages` | Buscar y listar mensajes con consulta Gmail, hasta 500 resultados por página | Lectura acotada del inbox; se usó `in:inbox` con máximo 10 resultados para verificar IDs, hilos, remitentes, asunto, fecha y snippet. |
| `gmail_read_threads`    | Leer uno o más hilos por ID, hasta 100, con cuerpo completo opcional         | Lectura autorizada posterior, limitada a mensajes seleccionados; no se ejecutó en esta comprobación inicial.                          |
| `gmail_send_messages`   | Guardar como borrador o enviar; activa confirmación interactiva              | No se utiliza. La plataforma no enviará mensajes externos automáticamente.                                                            |
| `gmail_manage_labels`   | Gestionar etiquetas Gmail                                                    | No se utiliza para evitar modificar el buzón durante la ingesta inicial.                                                              |

La búsqueda de verificación devolvió mensajes reales del inbox, incluyendo IDs y thread IDs Gmail. El resultado confirmó que el conector puede aportar metadatos y, mediante `gmail_read_threads`, cuerpos para una ingesta posterior. La aplicación no recibe credenciales Gmail dentro del repositorio: el conector vive fuera del runtime web y la mutación administrativa `admin.emailDraftIngest` acepta únicamente mensajes autorizados ya leídos, con máximo 20 por lote, normalización del remitente, truncado de contenido, upsert por `externalMessageId`, estado `draft` y auditoría administrativa.

No se realizaron envíos, cambios de etiquetas, archivados ni modificaciones en Gmail. La generación de respuesta conserva revisión humana; cualquier activación recurrente debe usar un callback o agente programado después de desplegar y verificar el sitio, nunca un timer dentro del proceso web.
