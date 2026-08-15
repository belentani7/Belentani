export const CATALOG_REFRESH_CALLBACK = "/api/scheduled/catalog-refresh";
export const GROWTH_REPORT_CALLBACK = "/api/scheduled/growth-report";
export const GMAIL_INGEST_CALLBACK = "/api/scheduled/gmail-ingest";
export const AUTOMATION_RUN_POLICY = {
  maxAttempts: 3,
  timeoutMs: 120_000,
} as const;

export type AutomationReadinessReason =
  | "deployment-required"
  | "callback-or-task-uid-missing"
  | "callback-task-and-deployment-ready";

export function getAutomationReadiness(input: {
  callbackPath: string;
  hasTaskUid: boolean;
  environment: string | undefined;
}) {
  const callbackReady = [
    CATALOG_REFRESH_CALLBACK,
    GROWTH_REPORT_CALLBACK,
    GMAIL_INGEST_CALLBACK,
  ].includes(input.callbackPath);
  const deploymentReady = input.environment === "production";
  const ready = callbackReady && input.hasTaskUid && deploymentReady;
  const reason: AutomationReadinessReason = !deploymentReady
    ? "deployment-required"
    : callbackReady && input.hasTaskUid
      ? "callback-task-and-deployment-ready"
      : "callback-or-task-uid-missing";
  return { ready, reason };
}

export function getSchedulerAttempt(input: {
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
}): number {
  const headers = input.headers ?? {};
  const rawHeader = headers["x-manus-attempt"] ?? headers["x-attempt"];
  const rawBody =
    input.body && typeof input.body === "object" && "attempt" in input.body
      ? (input.body as { attempt?: unknown }).attempt
      : undefined;
  const raw = Array.isArray(rawHeader) ? rawHeader[0] : (rawHeader ?? rawBody);
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 100 ? parsed : 1;
}

export function getFailureRunMetadata(
  attempt: number,
  maxAttempts = AUTOMATION_RUN_POLICY.maxAttempts
) {
  const deadLettered = attempt >= maxAttempts;
  return {
    quarantineReason: deadLettered
      ? "retry-exhausted-dead-letter"
      : "callback-failure-awaiting-platform-retry",
    ...(deadLettered ? { deadLetteredAt: new Date() } : {}),
  } as const;
}
