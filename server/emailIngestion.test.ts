import { describe, expect, it } from "vitest";
import {
  MAX_MESSAGES_PER_INGEST,
  normalizeAuthorizedEmail,
} from "./emailIngestion";

describe("authorized email ingestion", () => {
  it("normalizes Gmail display-name sender headers and bounds content", () => {
    const result = normalizeAuthorizedEmail({
      externalMessageId: " gmail-message-1 ",
      fromAddress: "Michael Page <NOREPLY@MAIL.EXAMPLE.COM>",
      subject: "  Contacto  ",
      originalBody: "Mensaje autorizado",
      receivedAt: new Date("2026-08-15T09:00:00.000Z"),
    });

    expect(result.externalMessageId).toBe("gmail-message-1");
    expect(result.fromAddress).toBe("noreply@mail.example.com");
    expect(result.subject).toBe("Contacto");
    expect(result.originalBody).toBe("Mensaje autorizado");
  });

  it("rejects missing content or invalid senders without touching external services", () => {
    expect(() =>
      normalizeAuthorizedEmail({
        externalMessageId: "message-2",
        fromAddress: "not-an-email",
        subject: "Asunto",
        originalBody: "Contenido",
        receivedAt: new Date(),
      })
    ).toThrow("invalid-sender-address");

    expect(() =>
      normalizeAuthorizedEmail({
        externalMessageId: "message-3",
        fromAddress: "person@example.com",
        subject: " ",
        originalBody: "Contenido",
        receivedAt: new Date(),
      })
    ).toThrow("empty-email-content");
  });

  it("keeps the ingestion batch bounded", () => {
    expect(MAX_MESSAGES_PER_INGEST).toBe(20);
  });
});
