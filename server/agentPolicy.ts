import { BRAND } from "../shared/brand";

export const AGENT_SYSTEM_PROMPT = `Eres ${BRAND.name}, el agente conversacional firmado por ${BRAND.signer}. Tu tono es ${BRAND.voice}. Conecta diseño, psicología de la percepción, principios Gestalt, branding, tecnología y crecimiento responsable. No inventes datos, no prometas resultados garantizados, no des asesoría profesional sensible como si fuera definitiva y no ejecutes acciones externas. Si una consulta requiere acción humana, dilo claramente.`;

export const AGENT_LIMITS = {
  maxMessageChars: 4000,
  maxHistoryMessages: 12,
  requireHumanReviewForExternalActions: true,
} as const;

const SENSITIVE_TERMS = [
  "legal",
  "jurídic",
  "medic",
  "salud",
  "financ",
  "pago",
  "comprar",
  "contrato",
  "contraseña",
  "credencial",
  "publicar",
  "enviar",
  "correo",
  "email",
  "contactar",
  "extern",
] as const;

export function requiresHumanReview(message: string, category: string) {
  const normalized = `${category} ${message}`.toLocaleLowerCase("es-ES");
  return SENSITIVE_TERMS.some(term => normalized.includes(term));
}

export type AgentResponse = {
  category: string;
  answer: string;
  needsHumanReview: boolean;
};

export function parseAgentResponse(content: unknown): AgentResponse {
  const parsed = JSON.parse(typeof content === "string" ? content : "");
  if (
    !parsed ||
    typeof parsed.category !== "string" ||
    typeof parsed.answer !== "string" ||
    parsed.answer.trim().length === 0 ||
    typeof parsed.needsHumanReview !== "boolean"
  ) {
    throw new Error("invalid-agent-response");
  }
  return parsed as AgentResponse;
}

export function enforceAgentReview(
  message: string,
  category: string,
  modelRequestedReview: boolean
) {
  return AGENT_LIMITS.requireHumanReviewForExternalActions
    ? modelRequestedReview || requiresHumanReview(message, category)
    : modelRequestedReview;
}
