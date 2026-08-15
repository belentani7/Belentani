import { invokeLLM } from "./_core/llm";
import { AGENT_SYSTEM_PROMPT } from "./agentPolicy";
import { getDb } from "./db";
import { notifyOperationalEvent } from "./operationalNotifications";
import { eq } from "drizzle-orm";
import { emailDrafts } from "../drizzle/schema";

export type AuthorizedEmailMessage = {
  externalMessageId: string;
  fromAddress: string;
  subject: string;
  originalBody: string;
  receivedAt: Date;
};

const MAX_MESSAGES_PER_INGEST = 20;
const MAX_BODY_LENGTH = 20_000;

function extractEmailAddress(value: string) {
  const match = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (!match) throw new Error("invalid-sender-address");
  return match[0].toLowerCase().slice(0, 320);
}

export function normalizeAuthorizedEmail(message: AuthorizedEmailMessage) {
  const normalized = {
    externalMessageId: message.externalMessageId.trim().slice(0, 240),
    fromAddress: extractEmailAddress(message.fromAddress),
    subject: message.subject.trim().slice(0, 500),
    originalBody: message.originalBody.slice(0, MAX_BODY_LENGTH),
    receivedAt: message.receivedAt,
  };
  if (
    !normalized.externalMessageId ||
    !normalized.subject ||
    !normalized.originalBody.trim()
  ) {
    throw new Error("empty-email-content");
  }
  return normalized;
}

async function classifyAndPersist(message: AuthorizedEmailMessage) {
  const normalized = normalizeAuthorizedEmail(message);
  const { fromAddress, subject, originalBody } = normalized;
  const result = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `${AGENT_SYSTEM_PROMPT} Clasifica el correo y redacta un borrador. Nunca afirmes que se ha enviado. Devuelve JSON con category y draftBody. No incluyas datos que no estén en el mensaje original.`,
      },
      {
        role: "user",
        content: `Asunto: ${subject}\\nRemitente: ${fromAddress}\\nContenido:\\n${originalBody}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "email_draft",
        strict: true,
        schema: {
          type: "object",
          properties: {
            category: { type: "string", maxLength: 120 },
            draftBody: { type: "string", maxLength: 20_000 },
          },
          required: ["category", "draftBody"],
          additionalProperties: false,
        },
      },
    },
  });
  const content = result.choices?.[0]?.message?.content;
  const parsed = JSON.parse(typeof content === "string" ? content : "") as {
    category: string;
    draftBody: string;
  };
  const db = await getDb();
  if (!db) throw new Error("database-unavailable");
  const existing = await db
    .select({ id: emailDrafts.id })
    .from(emailDrafts)
    .where(eq(emailDrafts.externalMessageId, normalized.externalMessageId))
    .limit(1);
  const category = parsed.category.trim().slice(0, 120) || "other";
  const draftBody = parsed.draftBody.trim().slice(0, 20_000);
  if (!draftBody) throw new Error("empty-draft-body");
  await db
    .insert(emailDrafts)
    .values({
      externalMessageId: normalized.externalMessageId,
      fromAddress,
      subject,
      receivedAt: normalized.receivedAt,
      category,
      originalBody,
      draftBody,
      status: "draft",
    })
    .onDuplicateKeyUpdate({
      set: {
        category,
        draftBody,
        status: "draft",
        updatedAt: new Date(),
      },
    });
  if (existing.length === 0) {
    void notifyOperationalEvent({
      event: "new_contact",
      route: "admin.emailDraftIngest",
      detail:
        "Se recibió un mensaje autorizado y se creó un borrador interno para revisión humana.",
    });
  }
  return { externalMessageId: normalized.externalMessageId, category };
}

export async function ingestAuthorizedEmails(
  messages: AuthorizedEmailMessage[]
) {
  if (messages.length > MAX_MESSAGES_PER_INGEST) {
    throw new Error(`too-many-messages:${MAX_MESSAGES_PER_INGEST}`);
  }
  const results: Array<{ externalMessageId: string; category: string }> = [];
  for (const message of messages) {
    results.push(await classifyAndPersist(message));
  }
  return results;
}

export { MAX_MESSAGES_PER_INGEST };
