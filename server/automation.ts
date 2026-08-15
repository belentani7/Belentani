export const CATALOG_REFRESH_CALLBACK = "/api/scheduled/catalog-refresh";
export const GROWTH_REPORT_CALLBACK = "/api/scheduled/growth-report";
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
