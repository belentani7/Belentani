type MetricState = {
  requests: number;
  agentResponses: number;
  agentFallbacks: number;
  scheduledSuccess: number;
  scheduledFailures: number;
  totalAgentLatencyMs: number;
};

const state: MetricState = {
  requests: 0,
  agentResponses: 0,
  agentFallbacks: 0,
  scheduledSuccess: 0,
  scheduledFailures: 0,
  totalAgentLatencyMs: 0,
};

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
