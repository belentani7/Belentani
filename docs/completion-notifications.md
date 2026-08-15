# Notificaciones de finalización

La interfaz de administración y el agente pueden avisar al usuario cuando una operación termina correctamente. El sistema es **opt-in**: las preferencias `desktop` y `sound` comienzan desactivadas y se guardan únicamente en `localStorage` del navegador.

| Control             | Comportamiento                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Aviso de escritorio | Se solicita `Notification.requestPermission()` solamente al pulsar el botón de permiso. Si el navegador no ofrece Notifications o el permiso fue denegado, el control queda deshabilitado. |
| Sonido              | Usa Web Audio API con un tono sintético corto; si AudioContext no existe o falla, la operación se completa silenciosamente. No se almacena ni carga ningún archivo de audio.               |
| Finalizaciones      | Se emiten desde respuestas exitosas del agente y mutaciones administrativas relevantes. Eventos idénticos dentro de un segundo se deduplican.                                              |
| Accesibilidad       | El panel usa `Label`, `Checkbox`, `role=status` y botones con texto visible. No requiere movimiento visual y no modifica la estructura pública de contenido.                               |
| Privacidad          | El texto de una respuesta, cuerpo de correo o datos del visitante no se incluye en la notificación.                                                                                        |

El comportamiento de autoplay depende de la política del navegador. La activación explícita desde el panel proporciona una interacción del usuario antes de intentar reproducir audio; aun así, el fallback silencioso siempre prevalece sobre bloquear la interfaz.
