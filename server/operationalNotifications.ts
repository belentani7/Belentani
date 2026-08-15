import { notifyOwner } from "./_core/notification";

const recentAlerts = new Map<string, number>();
const DEDUPE_WINDOW_MS = 15 * 60_000;

type OperationalAlert = {
  event: string;
  route: string;
  taskUid?: string | null;
  detail: string;
};

export async function notifyOperationalEvent(input: OperationalAlert) {
  const key = `${input.event}:${input.route}:${input.detail.slice(0, 160)}`;
  const now = Date.now();
  const previous = recentAlerts.get(key);
  if (previous && now - previous < DEDUPE_WINDOW_MS) return false;
  recentAlerts.set(key, now);
  if (recentAlerts.size > 1000) {
    recentAlerts.forEach((timestamp, alertKey) => {
      if (now - timestamp >= DEDUPE_WINDOW_MS) recentAlerts.delete(alertKey);
    });
  }
  try {
    return await notifyOwner({
      title: `NOIACORE LAB: ${input.event}`,
      content: [
        `Ruta: ${input.route}`,
        input.taskUid ? `Tarea: ${input.taskUid}` : "Tarea: no disponible",
        `Detalle: ${input.detail.slice(0, 500)}`,
        "No se incluye cuerpo de solicitud, correo, token ni datos personales.",
      ].join("\n"),
    });
  } catch {
    return false;
  }
}

export function notifyOperationalFailure(input: {
  event: string;
  route: string;
  taskUid?: string | null;
  error: string;
}) {
  return notifyOperationalEvent({
    event: input.event,
    route: input.route,
    taskUid: input.taskUid,
    detail: input.error,
  });
}

export function resetOperationalNotificationDedupeForTests() {
  recentAlerts.clear();
}
