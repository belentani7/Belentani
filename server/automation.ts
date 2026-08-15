export const CATALOG_REFRESH_CALLBACK = "/api/scheduled/catalog-refresh";

export type AutomationReadinessReason =
  | "deployment-required"
  | "callback-or-task-uid-missing"
  | "callback-task-and-deployment-ready";

export function getAutomationReadiness(input: {
  callbackPath: string;
  hasTaskUid: boolean;
  environment: string | undefined;
}) {
  const callbackReady = input.callbackPath === CATALOG_REFRESH_CALLBACK;
  const deploymentReady = input.environment === "production";
  const ready = callbackReady && input.hasTaskUid && deploymentReady;
  const reason: AutomationReadinessReason = !deploymentReady
    ? "deployment-required"
    : callbackReady && input.hasTaskUid
      ? "callback-task-and-deployment-ready"
      : "callback-or-task-uid-missing";
  return { ready, reason };
}
