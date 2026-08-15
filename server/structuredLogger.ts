export type LogLevel = "info" | "warn" | "error";

export type StructuredLog = {
  timestamp: string;
  level: LogLevel;
  event: string;
  context: Record<string, unknown>;
};

export function logStructured(
  level: LogLevel,
  event: string,
  context: Record<string, unknown> = {}
) {
  const entry: StructuredLog = {
    timestamp: new Date().toISOString(),
    level,
    event,
    context,
  };
  const serialized = JSON.stringify(entry);
  if (level === "error") console.error(serialized);
  else if (level === "warn") console.warn(serialized);
  else console.log(serialized);
  return entry;
}

export function logInfo(event: string, context?: Record<string, unknown>) {
  return logStructured("info", event, context);
}

export function logWarn(event: string, context?: Record<string, unknown>) {
  return logStructured("warn", event, context);
}

export function logError(event: string, context?: Record<string, unknown>) {
  return logStructured("error", event, context);
}
