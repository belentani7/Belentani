# Auditoría de seguridad aplicada

La capa de mutaciones del servidor aplica defensa de origen y un token CSRF de doble envío para solicitudes de navegador. Rechaza un `Origin` distinto del host servido, un `Referer` externo cuando no existe `Origin`, la señal `Sec-Fetch-Site: cross-site` y cualquier ausencia o discrepancia entre la cookie `noiacore_csrf` y el header `X-CSRF-Token`. Esto protege las rutas tRPC mutables y la subida de multimedia sin bloquear los callbacks programados, que tienen autenticación propia mediante la identidad de tarea.

También se añadió un límite temporal por dirección cliente. Las mutaciones tienen un máximo defensivo de 120 solicitudes por ventana de 60 segundos y las subidas de multimedia 12 solicitudes por ventana. La respuesta incluye cabeceras `X-RateLimit-*` y `Retry-After` cuando corresponde. La clave usa `X-Forwarded-For` si existe y, en su ausencia, `req.ip`.

| Área                  | Evidencia                                                                                              | Estado                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| Validación de entrada | Esquemas Zod/tRPC y validaciones específicas de subida                                                 | Implementado                                |
| SQL injection         | Acceso mediante Drizzle y parámetros tipados; no se construyen consultas con interpolación de usuario  | Implementado                                |
| XSS                   | React escapa texto; no se usa `dangerouslySetInnerHTML` para contenido editorial                       | Implementado                                |
| CSRF/origen           | Cookie `noiacore_csrf`, header `X-CSRF-Token` y validación de origen en `server/securityMiddleware.ts` | Implementado con doble envío para navegador |
| Rate limiting         | Buckets temporales por ruta e IP                                                                       | Implementado como protección best-effort    |
| Privilegios           | `adminProcedure`, comprobación de rol en subida y fronteras privadas                                   | Implementado                                |
| Secretos              | Valores fuera del repositorio y logging sin cuerpos sensibles                                          | Implementado                                |

El rate limiter es deliberadamente local al proceso. En Autoscale no sustituye un límite distribuido del proveedor o un gateway; por ello se considera defensa complementaria, no garantía absoluta frente a ataques coordinados. La activación productiva de tareas programadas sigue requiriendo despliegue y verificación del entorno.
