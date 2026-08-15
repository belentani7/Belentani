type MetricState = {
  requests: number;
  businessEvents: Record<string, number>;
  agentResponses: number;
  agentFallbacks: number;
  scheduledSuccess: number;
  scheduledFailures: number;
  totalAgentLatencyMs: number;
};

const state: MetricState = {
  requests: 0,
  businessEvents: {},
  agentResponses: 0,
  agentFallbacks: 0,
  scheduledSuccess: 0,
  scheduledFailures: 0,
  totalAgentLatencyMs: 0,
};

export function recordBusinessEvent(event: string) {
  if (!/^[a-z_]{3,48}$/.test(event)) return;
  state.businessEvents[event] = (state.businessEvents[event] ?? 0) + 1;
}

export function incrementRequest() {
  state.requests += 1;
}
export function recordAgent(latencyMs: number, fallback: boolean) {
  state.agentResponses += 1;
  state.totalAgentLatencyMs += latencyMs;
  if (fallback) state.agentFallbacks += 1;
}
export function recordScheduled(success: boolean) {
  if (success) state.scheduledSuccess += 1;
  else state.scheduledFailures += 1;
}
export function getMetrics() {
  return {
    ...state,
    averageAgentLatencyMs: state.agentResponses
      ? Math.round(state.totalAgentLatencyMs / state.agentResponses)
      : 0,
  };
}
