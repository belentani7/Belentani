# Secretos y conexiones pendientes

No se almacenan valores secretos en el repositorio. Las variables del sistema disponibles para el runtime incluyen autenticación Manus, JWT, base de datos, Forge/LLM, almacenamiento y analítica integrada; su gestión corresponde al entorno de despliegue.

| Integración             | Estado                      | Requisito para activarla                                                                                            |
| ----------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Manus OAuth             | Configurado por el entorno  | No añadir valores al código.                                                                                        |
| Base de datos           | Configurada por el entorno  | Mantener `DATABASE_URL` fuera del repositorio.                                                                      |
| Forge/LLM y storage     | Configurados por el entorno | Mantener claves server-side; no exponerlas al cliente.                                                              |
| Inbox autorizado        | Pendiente                   | Conector de correo y credenciales proporcionados por el propietario; no se activan ingestiones con datos ficticios. |
| Notificaciones externas | Pendiente                   | Canal, destinatario y consentimiento configurados explícitamente.                                                   |
| Jobs productivos        | Guardados                   | Despliegue productivo, task UID y callback verificado antes de activar.                                             |

Las pruebas y logs deben usar identificadores, estados y hashes; nunca cuerpos de correo, prompts completos, tokens, contraseñas o archivos privados.
