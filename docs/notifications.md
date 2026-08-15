# Notificaciones operativas

NOIACORE LAB usa el canal de notificación del propietario para alertas de fallos críticos en callbacks programados. La alerta se envía de forma best-effort, se deduplica durante quince minutos y solo contiene ruta, identificador de tarea, error truncado y una declaración explícita de que no se incluye cuerpo de solicitud, correo, token ni datos personales.

| Evento                           | Punto de emisión                                                                  | Canal                                   | Estado                           |
| -------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------- |
| Fallo de `catalog-refresh`       | Catch del callback programado                                                     | `notifyOwner`                           | Implementado                     |
| Fallo de `growth-report`         | Catch del callback programado                                                     | `notifyOwner`                           | Implementado                     |
| Nuevo contacto o correo entrante | Después de conectar inbox autorizado                                              | Pendiente de decidir por el propietario | Pendiente                        |
| Avisos de job pausado o huérfano | Historial `automation_runs`; notificación inmediata no activada para evitar ruido | Panel administrativo                    | Implementado como observabilidad |

La plataforma no envía respuestas externas ni notificaciones de correo a terceros desde esta capa. La ingestión de inbox y los borradores requieren una conexión autorizada y permanecen bajo revisión humana.
