import { z } from "zod";
import { BRAND } from "@shared/brand";

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

export const agentResponseSchema = z.object({
  category: z.string().trim().min(1).max(120),
  answer: z.string().trim().min(1).max(12_000),
  needsHumanReview: z.boolean(),
});

export type AgentResponse = z.infer<typeof agentResponseSchema>;

export function parseAgentResponse(content: unknown): AgentResponse {
  let parsed: unknown;
  try {
    parsed = JSON.parse(typeof content === "string" ? content : "");
  } catch (error) {
    if (error instanceof SyntaxError) throw error;
    throw new Error("invalid-agent-response");
  }
  const result = agentResponseSchema.safeParse(parsed);
  if (!result.success) throw new Error("invalid-agent-response");
  return result.data;
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
