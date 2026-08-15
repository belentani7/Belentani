type BusinessEvent =
  | "catalog_opened"
  | "agent_opened"
  | "agent_query_submitted"
  | "resource_opened"
  | "transparency_opened"
  | "contact_clicked";

export function trackBusinessEvent(
  event: BusinessEvent,
  properties: Record<string, string | number | boolean> = {},
  sendToBackend?: (event: BusinessEvent) => void
) {
  if (typeof window === "undefined") return;
  const payload = {
    event,
    properties: { ...properties, path: window.location.pathname },
    timestamp: new Date().toISOString(),
  };
  try {
    window.dispatchEvent(
      new CustomEvent("belentani:business-event", { detail: payload })
    );
    sendToBackend?.(event);
    const umami = (
      window as Window & {
        umami?: (name: string, data?: Record<string, unknown>) => void;
      }
    ).umami;
    umami?.(event, properties);
  } catch {
    // Analytics must never block a user action.
  }
}
